const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
dotenv.config();

module.exports = {
  signIn: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .send({ error: "Username and password are required" });
      }

      const user = await prisma.user.findFirst({
        select: {
          id: true,
          fname: true,
          lname: true,
          level: true,
          username: true,
          password: true,
          email: true,
          phone: true,
        },
        where: {
          username: username,
          status: "use",
        },
      });

      if (!user) {
        return res.status(401).send({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).send({ error: "Invalid username or password" });
      }

      const key = process.env.KEY;
      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        key,
        { expiresIn: "30d" }
      );
      return res.send({
        message: "Login successful",
        token: token,
        username: user.username,
        email: user.email,
        id: user.id,
        fname: user.fname,
        lname: user.lname,
        level: user.level,
        phone: user.phone,
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  signUp: async (req, res) => {
    try {
      const { firstName, lastName, userName, email, password, phone } =
        req.body;

      if (
        !firstName ||
        !lastName ||
        !userName ||
        !email ||
        !password ||
        !phone
      ) {
        return res.status(400).send({ error: "All fields are required" });
      }
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username: userName }, { email: email }],
        },
      });
      if (existingUser) {
        return res
          .status(400)
          .send({ error: "Username or email already exists" });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = await prisma.user.create({
        data: {
          fname: firstName,
          lname: lastName,
          username: userName,
          email: email,
          password: hashedPassword,
          phone: phone,
        },
      });

      const key = process.env.KEY;
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username, email: newUser.email },
        key,
        { expiresIn: "30d" }
      );

      return res.status(201).send({
        message: "success",
        token: token,
        username: newUser.username,
        email: newUser.email,
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  create: async (req, res) => {
    try {
      // Validate the request body
      const { firstName, lastName, userName, password, email, phone, level } =
        req.body;

      if (
        !firstName ||
        !lastName ||
        !userName ||
        !password ||
        !email ||
        !phone ||
        !level
      ) {
        return res.status(400).send({ error: "All fields are required." });
      }

      const existingUser = await prisma.user.findUnique({
        where: { userName },
      });

      if (existingUser) {
        return res.status(400).send({ error: "Username already exists." });
      }

      const existingEmail = await prisma.user.findUnique({ where: { email } });

      if (existingEmail) {
        return res.status(400).send({ error: "Email already exists." });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      // Create the user
      await prisma.user.create({
        data: {
          fname: firstName,
          lname: lastName,
          username: userName,
          password: hashedPassword,
          email: email,
          phone: phone,
          level: level,
        },
      });

      return res.send({ message: "success" });
    } catch (error) {
      console.error("Create user error:", error);
      return res.status(500).send({ error: error.message });
    }
  },
  list: async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          fname: true,
          lname: true,
          username: true,
          email: true,
          phone: true,
          level: true,
        },
        where: {
          status: "use",
        },
        orderBy: {
          id: "asc",
        },
      });
      return res.send({
        results: users,
      });
    } catch (error) {
      console.error("List users error:", error);
      return res.status(500).send({ error: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id, firstName, lastName, userName, email, phone, level } =
        req.body;

      if (
        !id ||
        !firstName ||
        !lastName ||
        !userName ||
        !email ||
        !phone ||
        !level
      ) {
        return res.status(400).send({ error: " All fields are required." });
      }

      const existingUser = await prisma.user.findUnique({ where: { id } });
      if (!existingUser || existingUser.status === "delete") {
        return res.status(404).send({ error: "User not found." });
      }

      await prisma.user.update({
        where: {
          id: { id },
        },
        data: {
          fname: firstName,
          lname: lastName,
          username: userName,
          email: email,
          phone: phone,
          level: level,
        },
      });
      return res.send({ message: "success" });
    } catch (error) {
      console.error("Update user error:", error);
      return res.status(500).send({ error: error.message });
    }
  },
  remove: async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).send({ error: "Invalid user ID." });
      }

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user || user.status === "delete") {
        return res.status(404).send({ error: "User not found." });
      }

      await prisma.user.update({
        where: {
          id: { id },
        },
        data: {
          status: "delete",
        },
      });

      return res.send({ message: "success" });
    } catch (error) {
      console.error("Remove user error:", error);
      return res.status(500).send({ error: error.message });
    }
  },
};
