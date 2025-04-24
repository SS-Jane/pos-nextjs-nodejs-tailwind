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

        const organizationId = newOrganization.id;

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
      //รับไฟล์จาก user
      const file = req.files.file;
      //เก็บนามสกุล
      const extension = file.name.split(".").pop();
      //ตั้งชื่อไฟล์ด้วยวันที่และเวลา
      const fileName = `logo_${Date.now()}.${extension}`;
      //ย้ายไฟล์ไปไว้ที่ folder logo
      file.mv(`./uploads/logo/${fileName}`);
      //หา ข้อมูลของ organization
      const organization = await prisma.organization.findFirst();
      //ถ้ามี
      if (organization) {
        //เรียกให้ fs module
        const fs = require("fs");
        const oldLogoPath = `./uploads/logo/${organization.logo}`;
        //ลบไฟล์ logo ของ organization
        if(fs.existsSync(oldLogoPath)){
          fs.unlinkSync(oldLogoPath);
        }
        
        //upload ไฟล์ที่ส่งมาจาก user
        await prisma.organization.update({
          where: {
            id: organization.id,
          },
          data: { logo: fileName },
        });
      }

      return res.send({ fileName: fileName });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
};
