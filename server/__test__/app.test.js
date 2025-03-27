const {
  test,
  expect,
  beforeEach,
  afterEach,
  describe,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, News, sequelize } = require("../models");
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const fs = require("fs").promises;

let access_token;

beforeEach(async () => {
  let rows = JSON.parse(await fs.readFile("./data/users.json", "utf8"));
  rows = rows.map((row) => {
    delete row.id;
    row.password = hashPassword(row.password);
    row.createdAt = new Date();
    row.updatedAt = new Date();
    return row;
  });
  await sequelize.queryInterface.bulkInsert("Users", rows);

  let { articles } = JSON.parse(await fs.readFile("./data/news.json", "utf8"));
  rows = articles.results.map((result) => {
    return {
      title: result.title,
      body: result.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await sequelize.queryInterface.bulkInsert("News", rows);

  const user = await User.findOne({
    where: {
      email: "user@mail.com",
    },
  });
  access_token = signToken({ id: user.id });
});

afterEach(async () => {
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await News.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("Login, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil login dan mengirimkan access_token", async () => {
    const response = await request(app).post("/login").send({
      email: "user@mail.com",
      password: "aaaaa",
    });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("access_token", expect.any(String));
  });

  test("Email tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/login").send({
      email: "",
      password: "aaaaa",
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("Password tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/login").send({
      email: "user@mail.com",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("Email diberikan invalid / tidak terdaftar", async () => {
    const response = await request(app).post("/login").send({
      email: "tesuser@mail.com",
      password: "aaaaa",
    });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });

  test("Password diberikan salah / tidak match", async () => {
    const response = await request(app).post("/login").send({
      email: "user@mail.com",
      password: "aa",
    });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid email or password"
    );
  });
});

describe("Register, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil membuat user", async () => {
    const response = await request(app).post("/register").send({
      name: "tes",
      email: "tes@mail.com",
      password: "aaaaa",
    });

    expect(response.status).toBe(201);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "User created successfully"
    );
  });

  test("Email tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/register").send({
      email: "",
      password: "aaaaa",
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "email is required");
  });

  test("Password tidak diberikan / tidak diinput", async () => {
    const response = await request(app).post("/login").send({
      email: "user@mail.com",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("Format email yang diberikan invalid", async () => {
    const response = await request(app).post("/register").send({
      email: "tesuser@mail",
      password: "aaaaa",
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "email must be of format email"
    );
  });

  test("Email diberikan sudah terdaftar", async () => {
    const response = await request(app).post("/register").send({
      email: "user@mail.com",
      password: "aaaaa",
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "email is already registered"
    );
  });

  test("Password diberikan di bawah 5 karakter", async () => {
    const response = await request(app).post("/register").send({
      email: "user@mail.com",
      password: "aa",
    });

    expect(response.status).toBe(400);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "minimal password length is 5 characters"
    );
  });
});

describe("Social media login, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Gagal login karena google token kosong", async () => {
    const response = await request(app).post("/auth/google").send({
      googleToken: "",
    });

    expect(response.status).toBe(500);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Internal server error");
  });
});

describe("Get user yang sedang login, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil get user yang sedang login", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("name", "user");
    expect(response.body).toHaveProperty("email", "user@mail.com");
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer token tidak valid`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("Update user, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil mengupdate data user", async () => {
    const response = await request(app)
      .patch("/users/edit")
      .send({
        name: "tesedit2",
      })
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "User updated successfully"
    );
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).patch("/users/edit").send({
      name: "tesedit2",
    });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .patch("/users/edit")
      .send({
        name: "tesedit2",
      })
      .set("Authorization", `Bearer token tidak valid`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("Delete user, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil delete data user", async () => {
    const response = await request(app)
      .delete("/users/delete")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty(
      "message",
      "User deleted successfully"
    );
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).delete("/users/delete");

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .delete("/users/delete")
      .set("Authorization", `Bearer token tidak valid`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("Get all news, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil get all news", async () => {
    const response = await request(app)
      .get("/news")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data[0]).toBeInstanceOf(Object);
    expect(response.body.data[0]).toHaveProperty("id", 1);
    expect(response.body.data[0]).toHaveProperty("title", expect.any(String));
    expect(response.body.data[0]).toHaveProperty("body", expect.any(String));
    expect(response.body.data[0]).toHaveProperty(
      "createdAt",
      expect.any(String)
    );
    expect(response.body.data[0]).toHaveProperty(
      "updatedAt",
      expect.any(String)
    );
  });

  test("Berhasil search news", async () => {
    const response = await request(app)
      .get("/news?q=liverpool")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data[0]).toBeInstanceOf(Object);
    expect(response.body.data[0]).toHaveProperty("id", 5);
    expect(response.body.data[0]).toHaveProperty("title", expect.any(String));
    expect(response.body.data[0]).toHaveProperty("body", expect.any(String));
    expect(response.body.data[0]).toHaveProperty(
      "createdAt",
      expect.any(String)
    );
    expect(response.body.data[0]).toHaveProperty(
      "updatedAt",
      expect.any(String)
    );
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).get("/news");

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .get("/news")
      .set("Authorization", `Bearer token tidak valid`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("Get news by id, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil get news by id", async () => {
    const response = await request(app)
      .get("/news/1")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("title", expect.any(String));
    expect(response.body).toHaveProperty("body", expect.any(String));
    expect(response.body).toHaveProperty("createdAt", expect.any(String));
    expect(response.body).toHaveProperty("updatedAt", expect.any(String));
  });

  test("News tidak ditemukan", async () => {
    const response = await request(app)
      .get("/news/47")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(404);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Data not found");
  });

  test("Id bukan angka", async () => {
    const response = await request(app)
      .get("/news/a")
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(500);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).get("/news/1");

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .get("/news/1")
      .set("Authorization", `Bearer token tidak valid`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("Summarize news, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil summarize", async () => {
    const response = await request(app)
      .post("/news/summarize")
      .send({
        text: `This is a test prompt`,
      })
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("text", expect.any(String));
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).post("/news/summarize").send({
      text: `This is a test prompt`,
    });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .post("/news/summarize")
      .send({
        text: `This is a test prompt`,
      })
      .set("Authorization", `Bearer token tidak valid`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("Synthesize speech, perlu melakukan pengecekan pada status dan response ketika:", () => {
  test("Berhasil synthesize", async () => {
    const response = await request(app)
      .post("/news/synthesize")
      .send({
        text: `This is a test prompt`,
      })
      .set("Authorization", `Bearer ${access_token}`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("audioContent", expect.any(String));
  });

  test("Gagal menjalankan fitur karena belum login", async () => {
    const response = await request(app).post("/news/synthesize").send({
      text: `This is a test prompt`,
    });

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("Gagal menjalankan fitur karena token yang diberikan tidak valid", async () => {
    const response = await request(app)
      .post("/news/synthesize")
      .send({
        text: `This is a test prompt`,
      })
      .set("Authorization", `Bearer token tidak valid`);

    expect(response.status).toBe(401);
    expect(response.body).toBeInstanceOf(Object);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});
