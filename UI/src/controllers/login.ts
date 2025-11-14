import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

function normalizeNick(nick: string) {
  return nick.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, "");
}

function nickEmail(nick: string) {
  return `${nick}@local.app`;
}

/* REGISTRO (Sign In) */
export async function registerNickname(nickname: string, password: string) {
  const nick = normalizeNick(nickname);
  if (!nick) throw new Error("Nickname inválido");
  if (password.length < 6)
    throw new Error("La contraseña debe tener al menos 6 caracteres.");

  const email = nickEmail(nick);

  // Verifica si el usuario ya existe
  try {
    await signInWithEmailAndPassword(auth, email, password);
    throw new Error("Este usuario ya existe. Inicia sesión en lugar de registrarte.");
  } catch (err: any) {
    if (err?.code !== "auth/user-not-found") {
      // Si el error no es "no existe", lo propagamos (p.ej. password inválida)
      if (err?.code !== "auth/invalid-credential") throw err;
    }
  }

  // Crea usuario nuevo
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const { user } = cred;

  try {
    const usernameRef = doc(db, "usernames", nick);
    const userRef = doc(db, "users", user.uid);

    await runTransaction(db, async (tx) => {
      const nickSnap = await tx.get(usernameRef);
      if (nickSnap.exists()) throw new Error("Ese nickname ya está en uso.");
      tx.set(usernameRef, { uid: user.uid, createdAt: serverTimestamp() });
      tx.set(userRef, {
        uid: user.uid,
        nickname: nick,
        email: user.email,
        createdAt: serverTimestamp(),
      });
    });

    const token = await user.getIdToken();
    return { token, user: { uid: user.uid, nickname: nick, email: user.email } };
  } catch (e) {
    try {
      if (auth.currentUser?.uid === user.uid) await deleteUser(auth.currentUser);
    } catch {}
    throw e;
  }
}

/* LOGIN (sin registro automático) */
export async function loginNickname(nickname: string, password: string) {
  const nick = normalizeNick(nickname);
  if (!nick) throw new Error("Nickname inválido");
  if (password.length < 6)
    throw new Error("La contraseña debe tener al menos 6 caracteres.");

  const email = nickEmail(nick);

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    return { token, user: { uid: cred.user.uid, nickname: nick, email } };
  } catch (err: any) {
    if (err?.code === "auth/user-not-found") {
      throw new Error("Usuario no encontrado. Regístrate primero.");
    } else if (err?.code === "auth/invalid-credential") {
      throw new Error("Contraseña incorrecta.");
    } else {
      throw new Error("Error al iniciar sesión.");
    }
  }
}



