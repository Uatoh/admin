import { useHistory, useLocation } from 'react-router-dom';
import './product.css';
import Chart from '../../components/chart/Chart';
import { Publish } from '@material-ui/icons';
import { useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { userRequest } from '../../requestMethods';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import app from '../../firebase';

export default function Product() {
  const location = useLocation();
  const history = useHistory();
  const productId = location.pathname.split('/')[2];
  const [pStats, setPStats] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    productDesc: '',
    price: '',
    inStock: '',
    image: null,
  });

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  const MONTHS = useMemo(
    () => [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get('orders/income?pid=' + productId);
        const list = res.data.sort((a, b) => {
          return a._id - b._id;
        });
        list.map((item) =>
          setPStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [productId, MONTHS]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let downloadURL = product.img;

      if (formData.image) {
        const fileName = new Date().getTime() + formData.image.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, formData.image);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            null,
            (error) => {
              console.error('Error uploading image:', error);
              reject(error);
            },
            async () => {
              try {
                downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                resolve();
              } catch (downloadError) {
                console.error('Error getting download URL:', downloadError);
                reject(downloadError);
              }
            }
          );
        });
      }

      const updatedProduct = {
        title: formData.productName || product.title,
        desc: formData.productDesc || product.desc,
        price: formData.price || product.price,
        inStock: formData.inStock || product.inStock,
        img: downloadURL,
      };

      await userRequest.put(`products/${productId}`, updatedProduct);
      history.push('/products');
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.img} alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">sales:</span>
              <span className="productInfoValue">5123</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">in stock:</span>
              <span className="productInfoValue">{product.inStock}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm" onSubmit={handleSubmit}>
          <div className="productFormLeft">
            <label>Product Name</label>
            <input
              type="text"
              placeholder={product.title}
              value={formData.productName}
              name="productName"
              onChange={handleChange}
            />
            <label>Product Description</label>
            <input
              type="text"
              placeholder={product.desc}
              value={formData.productDesc}
              name="productDesc"
              onChange={handleChange}
            />
            <label>Price</label>
            <input
              type="text"
              placeholder={product.price}
              value={formData.price}
              name="price"
              onChange={handleChange}
            />
            <label>In Stock</label>
            <select
              name="inStock"
              id="idStock"
              value={formData.inStock}
              onChange={handleChange}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={product.img} alt="" className="productUploadImg" />
              <label htmlFor="file">
                <Publish />
              </label>
              <input
                type="file"
                id="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            <button className="productButton" type="submit">
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
