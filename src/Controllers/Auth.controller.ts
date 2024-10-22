import { Request, Response } from "express";
import { Usuarios } from "../Database/Models/Usuarios";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AuthController = {
  iniciarSesion: async (req: Request, res: Response): Promise<Response | void> => {
    const { email, password } = req.body;

    try {
      // Buscar usuario por email
      const usuario = await Usuarios.findOne({ where: { email } });

      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Verificar la contraseña
      const validPassword = await bcrypt.compare(password, usuario.password_hash);
      if (!validPassword) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }

      // Crear el token JWT
      const token = jwt.sign(
        { idUsuario: usuario.idUsuario, email: usuario.email },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "1d" } 
      );

      return res.status(200).json({
        estado: true,
        message: "Inicio de sesión exitoso",
        token,
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return res.status(500).json({ estado: false, message: "Error interno del servidor", error });
    }
  },
};

export default AuthController;
