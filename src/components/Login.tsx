"use client";

import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useState } from "react";

interface ErrorMessages {
  email: string;
  password: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.log(result);
      return;
    }

    router.replace("/");
  };

  const togglePasswordVisibility = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };
  function getMessageForField(field: keyof ErrorMessages): string {
    switch (field) {
      case "email":
        return "Vamos precisar do seu email. :(";
      case "password":
        return "Senha é obrigatória.";

      default:
        return "";
    }
  }

  const handleBlur = (field: keyof ErrorMessages, value: string) => {
    console.log(field, value);
    setErrorMessage((prev: ErrorMessages) => {
      let errorMessage = value ? "" : getMessageForField(field);

      if (
        field === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        errorMessage = "Por favor, insira um e-mail válido.";
      }

      if (field === "password") {
        console.log("password", value);
        if (!value) {
          console.log("password ta vazio", value);
          errorMessage = getMessageForField(field);
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          )
        ) {
          console.log("password nao atende aos requisitos", value);
          errorMessage =
            "A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.";
        }
      }

      return {
        ...prev,
        [field]: errorMessage,
      };
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-primaryLight p-96 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-96 md:p-48 sm:w-full">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/petalas.svg"
            layout="fill"
            objectFit="cover"
            alt="Stylos Lingerie"
            className="opacity-50"
          />
        </div>

        <div className="relative z-10 bg-primary p-16 border-2 border-y-primaryDark rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-secondary mb-4 ">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <label htmlFor="email" className="text-white-important text-xs">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete='email'
              placeholder="Email"
              onBlur={() => handleBlur('email', email)}
              value={email}
              className="px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 "
              onChange={(e) => setEmail(e.target.value)}
            />
              {errorMessage.email && (
              <p className='text-redAtention text-xs italic'>
                {errorMessage.email}
              </p>
            )}

            <label htmlFor="email" className="text-white-important text-xs">
              Senha
            </label>
            <div className="relative w-96 md:w-72 sm:w-32">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Senha"
                autoComplete="password"
                value={password}
                onBlur={() => handleBlur("password", password)}
                className="px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32"
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                {showPassword ? (
                  <FiEyeOff
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer text-gray-500"
                  />
                ) : (
                  <FiEye
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer text-gray-500"
                  />
                )}
              </span>
              {errorMessage.password && (
                <p className="text-redAtention  text-xs italic">
                  {errorMessage.password}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="bg-secondary text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105"
            >
              Acessar
            </button>
            <button
              type="button"
              onClick={() => signIn("google")}
              className="bg-secondary text-white-important flex items-center justify-center px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105"
            >
              <FcGoogle className="mr-2" size={24} />
              Login com Google
            </button>
            <Link href="/cadastro">
              <button
                type="button"
                className="bg-secondary text-white-important px-2  text-xs py-1 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105"
              >
                Cadastro
              </button>
            </Link>

            <Link href="/" legacyBehavior>
              <a className="bg-secondary text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-32 md:w-32 sm:w-32 transition duration-300 hover:scale-105 mt-8">
                Voltar
              </a>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
