import api from "../services/api";
import { authHeader } from "../services/authHeader";

export const typeStatusMyOrders = {
  EM_ANASILE: 1,
  EM_PREPARACAO: 2,
  ROTA_ENTREGA: 3,
  RETIRAR_LOJA: 4,
  AGENDADO: 5,
  FINALIZADO: 6,
  GROUP: "1,2,3,4,5",
  ALL: "1,2,3,4,5,6",
};

/**
 * RETORNA UMA LISTA DE PEDIDOS, CONFORME O STATUS PASSADO.
 * @param {String} statusReq Recebe uma string contendo os id dos status dos
 * pedidos. Ex: 1: Em analise | 2: Em Preparação | 3: Rota de entrega | 4: Retira na Loja |
 * 5: Agendado  | 6: Finalizado
 */
export const getOrders = async (statusReq) => {
  const { Authorization } = authHeader();
  return await api
    .get("request", {
      headers: {
        Authorization: Authorization,
        statusRequest: statusReq,
      },
    })
    .then((response) => {
      return response.data;
    });
};

/**
 * RETORNAR UMA LISTA DE ITENS DE UM PEDIDO
 * @param {Number} idMyOrder Recebe um id do pedido
 */
export const getItemsMyOrders = async (idMyOrder) => {
  const { Authorization } = authHeader();
  return await api
    .get("request/items", {
      headers: {
        Authorization: Authorization,
        request_id: idMyOrder,
      },
    })
    .then((response) => response.data);
};
/**
 * ALTERA O STATUS DO PEDIDO
 * @param {Number} idMyOrder Recebe o id da Order para alterar o status do pedido
 * @returns Object {success: boolean, nextState: number, descriptionNextActionRequest: String}
 */
export const upDateStateMyOrders = async (idMyOrder) => {
  const { Authorization } = authHeader();
  return await api
    .put(
      `request/${idMyOrder}`,
      {},
      {
        headers: { Authorization: Authorization },
      }
    )
    .then((response) => response.data);
};

/**
 * REMOVER O PEDIDO INTEIRO
 * @param {Number} idMyOrder Recebe o id do pedido para ser excluido
 */
export const deletePedido = async (idMyOrder) => {
  const { Authorization } = authHeader();
  return await api
    .delete(`request/${idMyOrder}`, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};

/**
 * EXCLUSÃO DE ITEM DO PEDIDO
 * @param {number} idMyOrder Recebe o id do pedido
 * @param {number} idItem Recebe o id do item do pedido
 */
export const deleteItemPedido = async (idMyOrder, idItem) => {
  const { Authorization } = authHeader();
  return await api
    .delete(`request/item/${idItem}`, {
      headers: {
        Authorization: Authorization,
        request_id: idMyOrder,
      },
    })
    .then((response) => response.data);
};
/**
 * Retorna um object contendo o pedidos e outro objeto com os item do pedido
 * Object return { order, items }
 * @param {Object} item
 * @returns { order, items }
 */
export const addItemOrder = async (item) => {
  const { Authorization } = authHeader();
  return await api
    .post("request/item", item, {
      headers: { Authorization: Authorization },
    })
    .then((response) => response.data);
};
