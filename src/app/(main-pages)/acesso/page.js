"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/material";
import { FormGroup, FormControl, InputLabel, Input, Checkbox, FormControlLabel, InputAdornment, IconButton } from "@mui/material";
import { Api } from "../../../services/api";
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import Header from "../../../components/Header-NavMenu";
import Visibility from '@mui/icons-material/VisibilityOutlined';
import VisibilityOff from '@mui/icons-material/VisibilityOffOutlined';
import HeaderLogin from "../../../components/Header-Login";

const StyledContainer = styled("div")(({ theme }) => ({
  position: "fixed",
  right: 0,
  background: "#fafafa",
  zIndex: "1",
  height: "100vh",
  justifyItems: "center",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  marginTop: "2rem",
  [theme.breakpoints.up('xs')]: { // <= mobile
    padding: "5rem 1rem",
    width: "100vw",
  },
  [theme.breakpoints.up('md')]: { // >=mobile
    width: "70%"
  }
}));
const StyledLogin = styled("div")(({ theme }) => ({
  gap: "2rem",
  padding: "5rem 0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  width: "70%",
  [theme.breakpoints.up('xs')]: { // <= mobile
    padding: "0",
  },
}));
const StyledButton = styled("button")(() => ({
  width: "100%",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  background: "#084f54",
  padding: "10px",
  alignItems: "center",
  justifyContent: "center",
  margin: "1rem 0",
  border: "0",
  borderRadius: "8px",
  cursor: "pointer",
  color: "white",
  fontSize: "18px",
  "&:hover": {
    color: "white",
    border: "0",
    backgroundColor: " RGB(68, 119,130)",
  },
}));

const StyledLink = styled(Link)(() => ({
  color: "#084f54",
  cursor: "pointer",
}));
const StyledItems = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "1rem"
}));

const Acesso = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter(); // Usar useRouter en lugar de useNavigate
  const [username, setUsername] = useState("");
  const [rol, setRol] = useState(""); // Añadir estado para el rol

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Por favor, preencha todos os campos");
        return;
      }
      const passwordString = String(password);
      const normalizedEmail = email.toLowerCase();
      const response = await Api.post(`/login/usuarios?email=${normalizedEmail}&password=${passwordString}`);
      const username = response.data.username;
      const rol = response.data.roleMessage;
      setUsername(username);
      setRol(rol); // Guardar el rol en el estado
      console.log(rol + username);
      if (rol) {
        if (rol === 'Lider') {
          router.push("/minha-conta-lider"); 
        } else if (rol === 'Psicologo') {
          router.push("/minha-conta-psicologo");
        } else if (rol === 'Educadorsocial') {
          router.push("/minha-conta-educador");
        }
      }
    } catch (error) {
      console.error("Error al autenticar o cargar los datos del cliente:", error);
      setError("Email ou senha inválidos");
    }
  };

  const handleEmailChange = (event) => {
    const lowercasedEmail = event.target.value.toLowerCase();
    setEmail(lowercasedEmail);
    setError(null);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setError(null);
  };

  const [rememberMe, setRememberMe] = useState(false);

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="App SV">
      <div className="App-header">
        <Header />
      </div>
      <div className="background-image"></div>
      <StyledContainer>
        <Typography variant="h4" color="black">
          Seja bem-vindo(a) de volta
        </Typography>
        <Typography variant="body">
          Ainda não faz parte da equipe de voluntarios? <Link href="/cadastro">Clique aquí.</Link>
        </Typography>
        <StyledLogin>
          <FormGroup style={{ marginTop: "2rem" }}>
            <FormControl>
              <InputLabel
                style={{
                  all: "unset",
                  left: "0",
                  justifyContent: "start",
                  display: "flex",
                  textAlign: "left",
                }}
              >
                Email
              </InputLabel>
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
                className="input-text login"
              />
            </FormControl>
            <FormControl style={{ marginTop: "20px" }}>
              <InputLabel
                style={{
                  all: "unset",
                  left: "0",
                  justifyContent: "start",
                  display: "flex",
                  textAlign: "left",
                }}
              >
                Senha
              </InputLabel>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                required
                label="senha"
                fullWidth
                className="input-text login"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <StyledItems>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    style={{ color: "black", width: "20px", marginRight: "1rem" }}
                  />
                }
                label="Lembrar de mim"
              />
              <StyledLink href="/recuperar-senha">Esqueceu a senha?</StyledLink>
            </StyledItems>
            <StyledButton onClick={handleLogin}>Entrar</StyledButton>
            {error && <p style={{ color: "red" }}>{error}</p>}{" "}
          </FormGroup>
        </StyledLogin>
      </StyledContainer>
    </div>
  );
};

export default Acesso;