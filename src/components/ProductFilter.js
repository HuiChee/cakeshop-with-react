import React from 'react';
import styles from '../styles/ProductFilter.module.css'

const ProductFilter = ({onFilterChange}) => {
    /*const handleChange = (event) => {
        onFilterChange(event.target.value);
    };*/

    return (
        <div className="d-flex align-items-center">
            <h2 className={styles.title}>商品列表:</h2>
            <div className={styles.dropdown}>
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    选择商品
                </button>
                <div className={`dropdown-menu ${styles.dropdownMenu}`}>
                    <button onClick={() => onFilterChange('戚风蛋糕')}>戚风蛋糕</button>
                    <button onClick={() => onFilterChange('松饼')}>松饼</button>
                    <button onClick={() => onFilterChange('夹心蛋糕')}>夹心蛋糕</button>
                    <button onClick={() => onFilterChange('布丁')}>布丁</button>
                    <button onClick={() => onFilterChange('吐司')}>吐司</button>
                </div>
            </div>
        </div>
    );
};

export default ProductFilter;