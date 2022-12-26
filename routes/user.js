const express = require("express");
const router = express.Router();

const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth-middleware.js");

const { Op } = require("sequelize");
const { User } = require("../models");

// 회원가입
router.post("/users", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  // email or nickname이 동일한게 이미 있는지 확인하기 위해 가져온다.
  const existsUsers = await User.findAll({
    where: {
      [Op.or]: [{ email }, { nickname }],
    },
  });
  if (existsUsers.length) {
    res.status(400).send({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
    });
    return;
  }

  await User.create({ email, nickname, password });
  res.status(201).send({});
});

// 로그인
router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email,
    },
  });

  // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-responses
  if (!user || password !== user.password) {
    res.status(400).send({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
    return;
  }

  res.send({
    token: jwt.sign({ userId: user.userId }, "toss-secretKey"),
  });
});

router.get("/users/me", authMiddleware, async (req, res) => {
  res.json({ user: res.locals.user });
});

module.exports = router;
