import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { url } from "../../services/host";
import { SET_MESSAGE } from "../../store/Actions/types";
import {
  getProduct,
  getCategory,
  deleteProduto,
  getCategoryProduct,
} from "../../hooks";
import { Pagination, ModalView } from "../../components";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  Table,
  Row,
  Col,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";

const Product = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [dataProduct, setDataProduct] = useState([]);
  const [dataProductCategory, setDataProductCategory] = useState([]);
  const [totalPages, setTotalPages] = useState(null);
  const [totalProductInit, setTotalProductInit] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categorys, setCategorys] = useState([]);
  const [modal, setModal] = useState(false);
  const [titleModal, setTitleModal] = useState("");
  const [messageModal, setMessageModal] = useState("");
  const [indexProdModal, setIndexProdModal] = useState("");
  const [selectCategory, setSelectCategory] = useState([]);

  useEffect(() => {
    (() => {
      getProduct(pageCurrent).then((response) => {
        // Calcular numero da paginas
        const { countProducts } = response;
        const numPage = Math.ceil(countProducts / 10);
        setDataProduct(response.products);
        setTotalProduct(countProducts);
        setTotalProductInit(countProducts);
        setTotalPages(numPage);
      });
    })();
  }, [pageCurrent]);

  const dropdownToggle = (e) => {
    categorys.length <= 0 &&
      getCategory().then((response) => {
        setCategorys(response);
      });
    setDropdownOpen(!dropdownOpen);
  };

  const handleSelectCategoy = (item) => {
    const exist = selectCategory.findIndex((cat) => cat.id === item.id);
    if (exist === -1 || selectCategory.length === 0) {
      // Remover da lista Category
      const newListCat = categorys.filter(
        (category) => category.id !== item.id
      );
      setCategorys(newListCat);
      setSelectCategory([...selectCategory, item]);
      const categoryId = [...selectCategory, item]
        .map((item) => item.id)
        .toString();
      getCategoryProduct(categoryId).then((response) => {
        const { countProducts } = response;
        const numPage = Math.ceil(countProducts / 10);
        setDataProductCategory(response.products);
        setTotalPages(numPage);
        setTotalProduct(countProducts);
      });
    }
  };

  const handleRemoveSelectCategory = (item) => {
    const newSelectCat = selectCategory.filter((cat) => cat.id !== item.id);
    const newDataProductCat = dataProductCategory.filter(
      (prod) => prod.category_id !== item.id
    );
    setDataProductCategory(newDataProductCat);
    setCategorys([...categorys, item]); //Retornar a categoria no Dropbox
    setSelectCategory(newSelectCat);

    if (newSelectCat.length <= 0) {
      const numPage = Math.ceil(totalProductInit / 10);
      setTotalPages(numPage);
      setTotalProduct(totalProductInit);
    }
  };

  const BadgePromotion = (value) => {
    switch (value) {
      case true:
        return <span className="badge promotion">Promoção</span>;
      case false:
        return <span className="badge">Normal</span>;
      default:
        break;
    }
    return <span>{value ? "Promotion" : "Normal"}</span>;
  };

  const handleNewProduct = () => {
    history.push({ pathname: "productNew" });
  };

  const handleShowModal = (product) => {
    setIndexProdModal(product.id);
    setModal(true);
    setTitleModal("Remover Produto");
    setMessageModal(`Deseja realmente excluir o produto '${product.name}'.`);
  };

  const handleEditProduct = (product) => {
    history.push({
      pathname: "/productNew",
      state: product,
    });
  };

  const handleDeleteProduct = (index) => {
    deleteProduto(index).then((response) => {
      // Remover o produto do array
      const newProduct = dataProduct.filter((item) => item.id !== index);
      setDataProduct(newProduct);

      dispatch({
        type: SET_MESSAGE,
        payload: response.message,
      });
    });
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <ModalView
                  index={indexProdModal}
                  title={titleModal}
                  messageModal={messageModal}
                  action={(index) => handleDeleteProduct(index)}
                  modal={modal}
                  toggle={() => setModal(!modal)}
                />
                <CardTitle tag="h4">Meus Produtos </CardTitle>
                <div className="contentButton">
                  <Dropdown
                    isOpen={dropdownOpen}
                    toggle={(e) => dropdownToggle(e)}
                  >
                    <DropdownToggle>
                      <i className="nc-icon nc-bullet-list-67" />
                      <span> Categoria</span>
                    </DropdownToggle>
                    <DropdownMenu>
                      {categorys.map((item, idx) => (
                        <DropdownItem
                          key={idx}
                          id={item.id}
                          tag="a"
                          onClick={() => handleSelectCategoy(item)}
                        >
                          {item.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Button color="info" onClick={() => {}}>
                    <i className="fa fa-plus-square" aria-hidden="true" /> Novo
                    Categoria
                  </Button>
                  <Button color="info" onClick={() => handleNewProduct()}>
                    <i className="fa fa-plus-square" aria-hidden="true" /> Novo
                    Produto
                  </Button>
                </div>
                <div className="selectCategory">
                  {selectCategory.map((item) => (
                    <span key={item.id}>
                      <i
                        className="fa fa-times"
                        aria-hidden="true"
                        onClick={() => handleRemoveSelectCategory(item)}
                      />{" "}
                      {item.name}
                    </span>
                  ))}
                </div>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th colSpan="2" className="text-center">
                        Produto
                      </th>
                      <th>Descrição</th>
                      <th>Unidade</th>
                      <th className="text-right">Preço</th>
                      <th>Promoção</th>
                      <th className="text-right">P. Promoção</th>
                      <th>Categoria</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(dataProductCategory.length > 0 ||
                    selectCategory.length > 0
                      ? dataProductCategory
                      : dataProduct
                    ).map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <div className="contentImageName">
                            <object
                              data={item.image_url}
                              type="image/png"
                              className="avatar"
                            >
                              <img
                                src={`${url}/uploads/default.png`}
                                alt={item.description}
                                className="avatar"
                              />
                            </object>
                          </div>
                        </td>
                        <td className="title">{item.name}</td>
                        <td>{item.description}</td>
                        <td>{item.measureUnid}</td>
                        <td className="text-right">{item.price}</td>
                        <td className="text-center">
                          {BadgePromotion(item.promotion)}
                        </td>
                        <td className="text-right">{item.pricePromotion}</td>
                        <td className="text-center">{item.category}</td>
                        <td>
                          <div className="groupButton">
                            <Button
                              className="btn-round btn-icon"
                              color="danger"
                              outline
                              size="sm"
                              onClick={() => handleShowModal(item)}
                            >
                              <i className="fa fa-trash" />
                            </Button>
                            <Button
                              className="btn-round btn-icon"
                              color="success"
                              outline
                              size="sm"
                              onClick={() => handleEditProduct(item)}
                            >
                              <i className="fa fa-edit" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
              <CardFooter>
                <span className="totalProduct">
                  Total de produto: <strong>{totalProduct}</strong>{" "}
                </span>
                {!!totalPages && (
                  <Pagination
                    totalPage={totalPages}
                    onChange={setPageCurrent}
                  />
                )}
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};
export default Product;
