"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerNickname, loginNickname } from "../controllers/login";

export default function LoginPage() {
  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const DEST_PATH = "/mainpage";

  async function handleLogin(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginNickname(nickname, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(DEST_PATH, { replace: true });
    } catch (err: any) {
      setError(err?.message || "No fue posible iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    setError(null);
    setLoading(true);
    try {
      const data = await registerNickname(nickname, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(DEST_PATH, { replace: true });
    } catch (err: any) {
      setError(err?.message || "No fue posible registrarse.");
    } finally {
      setLoading(false);
    }
  }

  const disabled = loading || !nickname.trim() || !password;

  return (
    <main className="min-h-screen flex md:flex-row-reverse">
      <section className="hidden md:block basis-7/12 bg-[#101010]" />
      <section className="basis-full md:basis-5/12 bg-[#D9D9D9]">
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-full max-w-[540px] px-8">
            <h1 className="text-[44px] md:text-[52px] leading-tight font-medium tracking-[0.02em] text-[#101010] mb-10">
              User Login
            </h1>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Username"
                  className="w-full rounded-full px-5 py-3 bg-white text-[#101010] placeholder-[#8b8b8b]
                             shadow-md focus:outline-none focus:ring-2 focus:ring-[#007B61]/50"
                  autoComplete="username"
                />

                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full rounded-full pl-5 pr-12 py-3 bg-white text-[#101010] placeholder-[#8b8b8b]
                               shadow-md focus:outline-none focus:ring-2 focus:ring-[#007B61]/50"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-3 rounded-md text-sm
                               bg-[#F3F3F3] text-[#101010] hover:bg-[#E7E7E7] focus:outline-none
                               focus:ring-2 focus:ring-[#007B61]/40"
                  >
                    {showPwd ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600 px-1">{error}</p>}

              <div className="flex items-center gap-6 pt-2">
                <button
                  type="submit"
                  disabled={disabled}
                  className="w-48 rounded-lg text-white font-semibold py-2.5 shadow-lg
                             bg-gradient-to-r from-[#007011] via-[#009A5F] to-[#029F9F]
                             hover:brightness-90 active:opacity-90 disabled:opacity-60"
                >
                  {loading ? "…" : "Login"}
                </button>

                <button
                  type="button"
                  disabled={disabled}
                  onClick={handleRegister}
                  className="w-48 rounded-lg text-white font-semibold py-2.5 shadow-lg
                             bg-gradient-to-r from-[#007011] via-[#009A5F] to-[#029F9F]
                             hover:brightness-90 active:opacity-90 disabled:opacity-60"
                >
                  {loading ? "…" : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

