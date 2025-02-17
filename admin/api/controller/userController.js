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
          name: true,
          level: true,
          username : true,
          password: true,
          email: true,
          fname: true,
          lname: true,
          phone: true,
        },
        where: {
          username: username,
          status: "use",
        },
      });

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).send({ error: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;

      const key = process.env.KEY;
      const token = jwt.sign(userWithoutPassword, key, { expiresIn: "30d" });
      return res.send({
        token: token,
        name: user.name,
        username : user.username,
        email: user.email,
      });
    } catch (error) {
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error instanceof Error
        ? error.message
        : "An unknown error occurred";
      return res.status(500).send({ error: error.message });
    }
  },
};
