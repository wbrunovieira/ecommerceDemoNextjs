'use client';
import React, { useState, SyntheticEvent, useRef } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

interface ErrorMessages {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const CadastroForm = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleSignInDisabled, setIsGoogleSignInDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const router = useRouter();

  const googleBtnRef = useRef<HTMLButtonElement>(null);
  const googleIconWrapperRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const togglePasswordVisibility = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(!showPassword);
  };
  const handleGoogleSignInClick = async () => {
    setIsGoogleSignInDisabled(true);
    const tl = gsap.timeline();
    tl.to(textRef.current, { opacity: 0, duration: 0.4 })
      .to(
        googleBtnRef.current,
        { scale: 0.95, backgroundColor: '#ccc', duration: 0.4 },
        '<'
      )
      .fromTo(
        googleIconWrapperRef.current,
        { rotation: 0, x: 0, transformOrigin: 'center center' },
        { rotation: 360, x: 100, duration: 1, ease: 'none' },
        '<'
      );

    await new Promise((resolve) => setTimeout(resolve, 2000));
    await signIn('google');

    setIsGoogleSignInDisabled(false);
  };

  const handleBlur = (field: keyof ErrorMessages, value: string) => {
    console.log(field, value);
    setErrorMessage((prev: ErrorMessages) => {
      let errorMessage = value ? '' : getMessageForField(field);

      if (
        field === 'email' &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        errorMessage = 'Por favor, insira um e-mail válido.';
      }

      if (field === 'password') {
        console.log('password', value);
        if (!value) {
          console.log('password ta vazio', value);
          errorMessage = getMessageForField(field);
        } else if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
            value
          )
        ) {
          console.log('password nao atende aos requisitos', value);
          errorMessage =
            'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.';
        }
      }

      if (field === 'repeatPassword' && value !== password) {
        errorMessage = 'As senhas não coincidem.';
      }

      return {
        ...prev,
        [field]: errorMessage,
      };
    });
  };

  function getMessageForField(field: keyof ErrorMessages): string {
    switch (field) {
      case 'name':
        return 'Esqueceu de colocar o seu nome. :(';
      case 'email':
        return 'Vamos precisar do seu email. :(';
      case 'password':
        return 'Senha é obrigatória.';
      case 'repeatPassword':
        return 'Você precisa repetir a senha.';
      default:
        return '';
    }
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    console.log('submit', name, email, password, repeatPassword);

    gsap.to('#submitButton', {
      scale: 0.95,
      duration: 0.2,
      ease: 'power1.out',
    });
    gsap.to('#submitButton', {
      scale: 1,
      duration: 0.2,
      ease: 'power1.out',
    });
    console.log('depois da animacao');
    if (password !== repeatPassword) {
      setErrorMessage((prev) => ({
        ...prev,
        repeatPassword: 'As senhas não coincidem. Por favor, tente novamente.',
      }));
      return;
    }

    const result = await signIn('credentials', {
      name,
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      console.log(result);
      return;
    }
    console.log('conexao bem suvedida e redirecionando')

    router.replace('/');
  };

  return (
    <div className='fixed inset-0 flex items-center justify-center'>
      <div className='bg-primaryLight p-96 rounded-lg shadow-lg z-10 relative overflow-hidden lg:p-96 md:p-48 sm:w-full'>
        <div className='absolute inset-0 z-0'>
          <Image
            src='/images/petalas.svg'
            layout='fill'
            objectFit='cover'
            alt='Stylos Lingerie'
            className='opacity-50'
          />
        </div>
        <div className='relative z-10 bg-primary p-16 border-2 border-y-primaryDark rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold text-secondary mb-4'>Cadastro</h2>

          <form onSubmit={handleSubmit} className='flex flex-col container '>
            <label htmlFor='name' className='text-white-important text-xs'>
              Nome
            </label>
            <input
              id='name'
              autoComplete='name'
              type='text'
              name='name'
              required
              placeholder='nome'
              value={name}
              onBlur={() => handleBlur('name', name)}
              onChange={(e) => setName(e.target.value)}
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 mb-4 focus:border-primaryDark focus:ring-4 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary required  placeholder-primary  '
            />
            {errorMessage.name && (
              <p className='text-redAtention text-xs italic'>
                {errorMessage.name}
              </p>
            )}

            <label htmlFor='email' className='text-white-important text-xs'>
              Email
            </label>
            <input
              id='email'
              type='email'
              autoComplete='email'
              name='email'
              required
              placeholder='email'
              onBlur={() => handleBlur('email', email)}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 mb-4 focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary invalid:border-red-400 placeholder-primary'
            />
            {errorMessage.email && (
              <p className='text-redAtention text-xs italic'>
                {errorMessage.email}
              </p>
            )}

            <label htmlFor='email' className='text-white-important text-xs'>
              Senha
            </label>
            <div className='relative w-96 md:w-72 sm:w-32'>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                name='password'
                required
                autoComplete='password'
                placeholder='Senha'
                onBlur={() => handleBlur('password', password)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-full pr-10 focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary placeholder-primary'
              />
              <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
                {showPassword ? (
                  <FiEyeOff
                    onClick={togglePasswordVisibility}
                    className='cursor-pointer text-gray-500'
                  />
                ) : (
                  <FiEye
                    onClick={togglePasswordVisibility}
                    className='cursor-pointer text-gray-500'
                  />
                )}
              </span>
              {errorMessage.password && (
                <p className='text-redAtention  text-xs italic'>
                  {errorMessage.password}
                </p>
              )}
            </div>
            <label htmlFor='email' className='text-white-important text-xs'>
              Repetir a senha
            </label>
            <div className='relative w-96 md:w-72 sm:w-32'>
              <input
                id='repeatPassword'
                type={showPassword ? 'text' : 'password'}
                name='repeatPassword'
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                onBlur={() => handleBlur('repeatPassword', repeatPassword)}
                required
                placeholder='Repetir a senha'
                className='px-4 py-2 rounded-lg shadow-sm bg-white bg-opacity-80 w-96 md:w-72 sm:w-32 mb-4 focus:border-primaryDark focus:ring-2 focus:ring-secondary focus:ring-opacity-50 focus:outline-none caret-secondary placeholder-primary'
              />
              <span className='absolute inset-y-0 right-0 flex items-center pr-3'>
                {showPassword ? (
                  <FiEyeOff
                    onClick={togglePasswordVisibility}
                    className='cursor-pointer text-gray-500 '
                  />
                ) : (
                  <FiEye
                    onClick={togglePasswordVisibility}
                    className='cursor-pointer text-gray-500'
                  />
                )}
              </span>
            </div>
            {errorMessage.password && (
              <p className='text-redAtention text-xs italic'>
                {errorMessage.password}
              </p>
            )}
            {errorMessage.repeatPassword && (
              <p className='text-primaryDark w-48 rounded-md text-xs mb-4 bg-primaryLight p-2'>
                {errorMessage.repeatPassword}
              </p>
            )}

            <button
              type='submit'
              id='submitButton'
              className='bg-secondary mb-4 text-white-important px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105'
            >
              Cadastrar
            </button>

            <button
              type='button'
              disabled={isGoogleSignInDisabled}
              ref={googleBtnRef}
              className='bg-secondary text-white-important flex items-center justify-center px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark w-96 md:w-72 sm:w-32 transition duration-300 hover:scale-105'
              onClick={handleGoogleSignInClick}
            >
              <div ref={googleIconWrapperRef}>
                <FcGoogle className='mr-2' size={24} />
              </div>
              <span ref={textRef} className='mr-2'>
                Login com Google
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CadastroForm;
