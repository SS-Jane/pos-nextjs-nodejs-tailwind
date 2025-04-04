const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      const oldOrganization = await prisma.organization.findMany();
      
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};
