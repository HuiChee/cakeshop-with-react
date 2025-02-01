import React, { useEffect, useState } from 'react';
import "../styles/ProductList.css"

const ProductList = ({filter, onResetFilter}) => {
    const products = [
        {name: "桂花米酒戚风蛋糕", type: '戚风蛋糕', price: "130元", image: "/images/product/cake1.jpg"},
        {name: "莓果戚风蛋糕", type: '戚风蛋糕', price: "130元", image: "/images/product/cake2.jpg"},
        {name: "巧克力戚风蛋糕", type: '戚风蛋糕', price: "130元", image: "/images/product/cake3.jpg"},
        {name: "抹茶戚风蛋糕", type: '戚风蛋糕', price: "130元", image: "/images/product/cake4.jpg"},
        {name: "莓果松饼", type: '松饼', price: "110元", image: "/images/product/cake5.jpg"},
        {name: "草莓可颂布丁", type: '布丁', price: "160元", image: "/images/product/cake6.jpg"},
        {name: "草莓可可夹心蛋糕", type: '夹心蛋糕', price: "140元", image: "/images/product/cake7.jpg"},
        {name: "草莓坚果可可松饼", type: '松饼', price: "120元", image: "/images/product/cake8.jpg"},
        {name: "香蕉脆皮吐司", type: '吐司', price: "120元", image: "/images/product/cake9.jpg"}
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

        window.scrollTo(0, window.scrollY);
    }, [currentPage, filter, filteredProducts, currentProducts]);

    const renderPagination = () => {
        let paginationButtons = [];

        if (currentPage > 1) {
            paginationButtons.push(
                <button key="prev" onClick={() => setCurrentPage(currentPage - 1)}>上一页</button>
            );
        }

        for (let i = 1; i <= totalPages; i++) {
            paginationButtons.push(
                <button 
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{border: "none", backgroundColor: "white", color: i === currentPage ? "blue" : "black"}}>
                    {i}
                </button>
            );
        }

        if (currentPage < totalPages) {
            paginationButtons.push(
                <button key="next" onClick={() => setCurrentPage(currentPage + 1)}>下一页</button>
            );
        }

        return paginationButtons;
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

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
                                    <button className='buy' type='button'>查看</button>
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