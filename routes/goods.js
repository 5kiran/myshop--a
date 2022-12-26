const express = require("express");
const router = express.Router();

const { Goods } = require("../models");
const authMiddleware = require("../middleware/auth-middleware.js");

// 모든 상품 가져오기
router.get("/goods", authMiddleware, async (req, res) => {
  const { category } = req.query;
  const goods = await Goods.findAll({
    order: [["goodsId", "DESC"]],
    where: category ? { category } : undefined,
  });

  res.send({ goods });
});

/**
 * 상품 하나만 가져오기
 */
router.get("/goods/:goodsId", authMiddleware, async (req, res) => {
  const { goodsId } = req.params;
  const goods = await Goods.findByPk(goodsId);

  if (!goods) {
    res.status(404).send({});
  } else {
    res.send({ goods });
  }
});

// 상품 추가
router.post("/goods", async (req, res) => {
  const { name, thumbnailUrl, category, price } = req.body;

  goods = await Goods.create({ name, thumbnailUrl, category, price });
  res.json({ goods });
});

module.exports = router;
