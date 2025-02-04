import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styles from "../styles/ProductDetail.module.css";

const ProductDetail = () => {
    const { productId } = useParams();
    //console.log(productId);
    const [product, setProduct ] = useState(null);

    const products = useMemo(() => [
        {name: "桂花米酒戚风蛋糕", price: "130元", image: "/images/product/cake1.jpg", description: "材料详情：花蜜，干桂花，牛奶\n产品详情：需放冰箱保存，保质期3天"},
        {name: "莓果戚风蛋糕", price: "130元", image: "/images/product/cake2.jpg", description: "材料详情：莓果，牛奶\n产品详情：需放冰箱保存，保质期3天"},
        {name: "巧克力戚风蛋糕", price: "130元", image: "/images/product/cake3.jpg", description: "材料详情：巧克力，牛奶，柠檬汁\n产品详情：需放冰箱保存，保质期3天"},
        {name: "抹茶戚风蛋糕", price: "130元", image: "/images/product/cake4.jpg", description: "材料详情：抹茶，牛奶\n产品详情：需放冰箱保存，保质期3天"},
        {name: "莓果松饼", price: "110元", image: "/images/product/cake5.jpg", description: "材料详情：莓果，牛奶\n产品详情：需放冰箱保存，保质期3天"},
        {name: "草莓可颂布丁", price: "160元", image: "/images/product/cake6.jpg", description: "材料详情：草莓，蓝莓，牛奶\n产品详情：需放冰箱保存，保质期3天"},
        {name: "草莓可可夹心蛋糕", price: "140元", image: "/images/product/cake7.jpg", description: "材料详情：草莓，可可\n产品详情：需放冰箱保存，保质期3天"},
        {name: "草莓坚果可可松饼", price: "120元", image: "/images/product/cake8.jpg", description: "材料详情：草莓，坚果，可可粉\n产品详情：需放冰箱保存，保质期3天"},
        {name: "香蕉脆皮吐司", price: "120元", image: "/images/product/cake9.jpg", description: "材料详情：香蕉，坚果，牛奶\n产品详情：需放冰箱保存，保质期3天"}
    ], []);

    useEffect(() => {
        const product = products[parseInt(productId, 10)];
        setProduct(product);
    }, [productId, products]);

    if(!product) {
        return <p>加载中...</p>;
    }

    return (
        <div id='product-detail-container' className={styles.productDetailContainer}>
            <div id='product-detail' className={styles.productDetail}>
                <img id='product-image' className={styles.productImage} src={product.image} alt={product.name} />
                <div className='product-info'>
                    <h2 id='product-name' className={styles.productName}>{product.name}</h2>
                    <h3 id='product-price' className={styles.productPrice}>{product.price}</h3>
                    <p id='product-description' className={styles.productDescription}>{product.description}</p>
                    <button className={styles.buy} type='button'>放入购物车</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;