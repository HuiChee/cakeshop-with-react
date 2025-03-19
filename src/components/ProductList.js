import React, { useEffect, useState } from 'react';
import "../styles/ProductList.css"

const ProductList = ({filter, onResetFilter}) => {
    const products = [
        {name: "桂花米酒戚风蛋糕", type: '戚风蛋糕', price: "130元", image: "/images/product/cake1.jpg", index:"0"},
        {name: "莓果戚风蛋糕", type: '戚风蛋糕', price: "130元", image: "/images/product/cake2.jpg", index:"1"},
        {name: "巧克力戚风蛋糕", type: '戚风蛋糕', price: "130元", image: "/images/product/cake3.jpg", index:"2"},
        {name: "抹茶戚风蛋糕", type: '戚风蛋糕', price: "130元", image: "/images/product/cake4.jpg", index:"3"},
        {name: "莓果松饼", type: '松饼', price: "110元", image: "/images/product/cake5.jpg", index:"4"},
        {name: "草莓可颂布丁", type: '布丁', price: "160元", image: "/images/product/cake6.jpg", index:"5"},
        {name: "草莓可可夹心蛋糕", type: '夹心蛋糕', price: "140元", image: "/images/product/cake7.jpg", index:"6"},
        {name: "草莓坚果可可松饼", type: '松饼', price: "120元", image: "/images/product/cake8.jpg", index:"7"},
        {name: "香蕉脆皮吐司", type: '吐司', price: "120元", image: "/images/product/cake9.jpg", index:"8"}
    ];

    const filteredProducts = filter ? products.filter(product => product.type === filter) : products;

    const itemsPerPage = 4;
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const [currentPage, setCurrentPage] = useState(1);
    const [currentProducts, setCurrentProducts] = useState([]);

    useEffect(() => {

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
        const newProducts = filteredProducts.slice(startIndex, endIndex);

        if (JSON.stringify(newProducts) !== JSON.stringify(currentProducts)){
            setCurrentProducts(newProducts);
        }

        //window.scrollTo(0, window.scrollY);

    }, [currentPage, filter, filteredProducts, currentProducts]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        const productContainer = document.getElementById('product-container');
        if(productContainer){
            productContainer.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    };

    const renderPagination = () => {
        let paginationButtons = [];

        if (currentPage > 1) {
            paginationButtons.push(
                <button key="prev" onClick={() => handlePageChange(currentPage - 1)}>上一页</button>
            );
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationButtons.push(
                <button 
                key={i}
                onClick={() => handlePageChange(i)}
                style={{border: "none", backgroundColor: "white", color: i === currentPage ? "blue" : "black"}}>
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages) {
            paginationButtons.push(
                <button key="next" onClick={() => handlePageChange(currentPage + 1)}>下一页</button>
            );
        }

        return paginationButtons;
    };

    //const navigate = useNavigate();

    const handleViewProduct = (productId) => {
        //navigate(`/ProductDetail/${productId}`);
        const filterProduct = filteredProducts[(currentPage - 1) * itemsPerPage + productId];
        //console.log(filterProduct);

        window.open(`/ProductDetail/${filterProduct.index}`, '_blank');
    };

    return (
        <div>
            <div className='product-display'>
                <div className='row' id='product-container'>
                    {currentProducts.map((product, index) => (
                        <div key={index} className='col-lg-3 col-md-6 col-sm-12 photo-column'>
                            <div className='photo'>
                                <img src={product.image} alt={product.name} />
                                <h5 className='product-info'>{product.name}</h5>
                                <div className='container'>
                                    <h5 className='product-price'>{product.price}</h5>
                                    <button 
                                    className='buy' 
                                    type='button'
                                    onClick={() => handleViewProduct(index)}>
                                        查看
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='reset-filter'>
                {filter && <button onClick={onResetFilter}>取消筛选</button>}
            </div>

            <div className='pagination'>
                {renderPagination()}
            </div>
        </div>
    );
};

export default ProductList;