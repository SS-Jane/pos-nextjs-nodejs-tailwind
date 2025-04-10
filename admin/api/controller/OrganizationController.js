const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = {
  create: async (req, res) => {
    try {
      const oldOrganization = await prisma.organization.findMany();
      const payload = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        email: req.body.email,
        website: req.body.website,
        promptpay: req.body.promptpay,
        logo: req.body.logo,
        taxCode: req.body.taxCode,
      };

      if (oldOrganization.length == 0) {
        const newOrganization = await prisma.organization.create({
          data: payload,
        });

        organizationId = newOrganization.id;

        if (!organizationId) {
          console.error("Failed to create Organization");
          return res.status(500).send({ error: "Database error" });
        }
      } else {
        const updateOrganization = await prisma.organization.update({
          where: {
            id: oldOrganization[0].id,
          },
          data: payload,
        });

        organizationId = updateOrganization.id;
        if (!organizationId) {
          console.error("Failed to update Organization");
          return res.status(500).send({ error: "Database error" });
        }
      }

      return res.send({ message: "success" });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  info: async (req, res) => {
    try {
      const organization = await prisma.organization.findFirst();

      return res.send({ results: organization });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
  upload: async (req, res) => {
    try {
      const file = req.files.file;

      const extension = file.name.split(".").pop();

      const fileName = `logo_${Date.now()}.${extension}`;

      file.mv(`./uploads/logo/${fileName}`);

      return res.send({ fileName: fileName });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};
