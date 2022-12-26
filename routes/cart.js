const express = require("express");
const router = express.Router();

const { Cart, Goods } = require("../models");
const authMiddleware = require("../middleware/auth-middleware.js");

/**
 * 내가 가진 장바구니 목록을 전부 불러온다.
 */
router.get("/goods/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  const cart = await Cart.findAll({
    where: {
      userId,
    },
  });

  const goodsIds = cart.map((c) => c.goodsId);

  // 루프 줄이기 위해 Mapping 가능한 객체로 만든것
  const goodsKeyById = await Goods.findAll({
    where: {
      goodsId: goodsIds,
    },
  }).then((goods) =>
    goods.reduce(
      (prev, g) => ({
        ...prev,
        [g.goodsId]: g,
      }),
      {}
    )
  );

  res.send({
    cart: cart.map((c) => ({
      quantity: c.quantity,
      goods: goodsKeyById[c.goodsId],
    })),
  });
});

/**
 * 장바구니에 상품 담기.
 * 장바구니에 상품이 이미 담겨있으면 갯수만 수정한다.
 */
router.put("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCart = await Cart.findOne({
    where: {
      userId,
      goodsId,
    },
  });

  if (existsCart) {
    existsCart.quantity = quantity;
    await existsCart.save();
  } else {
    await Cart.create({
      userId,
      goodsId,
      quantity,
    });
  }

  // NOTE: 성공했을때 응답 값을 클라이언트가 사용하지 않는다.
  res.send({});
});

/**
 * 장바구니 항목 삭제
 */
router.delete("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;

  console.log(userId);

  const existsCart = await Cart.findOne({
    where: {
      userId,
      goodsId,
    },
  });
  console.log(existsCart);

  // 있든 말든 신경 안쓴다. 그냥 있으면 지운다.
  if (existsCart) {
    existsCart.destroy();
  }

  // NOTE: 성공했을때 딱히 정해진 응답 값이 없다.
  res.send({});
});

module.exports = router;
