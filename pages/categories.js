import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name,setName] = useState('');
  const [parentCategory,setParentCategory] = useState('');
  const [categories,setCategories] = useState([]);
  const [properties,setProperties] = useState([]);
  useEffect(() => {
    fetchCategories();
  }, [])
  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }
  async function saveCategory(ev){
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties:properties.map(p => ({
        name:p.name,
        values:p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }
  function editCategory(category){
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({name,values}) => ({
      name,
      values:values.join(',')
    }))
    );
  }
  function deleteCategory(category){
    swal.fire({
      title: 'آیا اطمینان دارید',
      text: `میخواهید این دسته بندی را حذف کنید ${category.name}?`,
      showCancelButton: true,
      cancelButtonText: 'لغو',
      confirmButtonText: 'بله حذفش کن',
      confirmButtonColor: '#d55',
      reverseButtons: true,إ
    }).then(async result => {
      if (result.isConfirmed) {
        const {_id} = category;
        await axios.delete('/api/categories?_id='+_id);
        fetchCategories();
      }
    });
  }
  function addProperty() {
    setProperties(prev => {
      return [...prev, {name:'',values:''}];
    });
  }
  function handlePropertyNameChange(index,property,newName) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }
  function handlePropertyValuesChange(index,property,newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }
  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p,pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }
  return (
    <Layout>
      <h1>دسته بندی ها</h1>
      <label>
        {editedCategory
          ? `ویرایش دسته بندی ${editedCategory.name}`
          : 'ساخت دسته بندی جدید'}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'نام دسته بندی'}
            onChange={ev => setName(ev.target.value)}
            value={name}/>
          <select
                  onChange={ev => setParentCategory(ev.target.value)}
                  value={parentCategory}>
            <option value="">بدون دسته بندی والد</option>
            {categories.length > 0 && categories.map(category => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className="btn-default">لغو</button>
          )}
          <button type="submit"
                  className="btn-primary py-1">
           ذخیره
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
          <thead>
          <tr>
            <td>نام دسته بندی</td>
            <td>دسته بندی والد</td>
            <td></td>
          </tr>
          </thead>
          <tbody>
          {categories.length > 0 && categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category?.parent?.name}</td>
              <td>
                <button
                  onClick={() => editCategory(category)}
                  className="btn-default mr-1"
                >
                  ویرایش
                </button>
                <button
                  onClick={() => deleteCategory(category)}
                  className="btn-red">حذف</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
  <Categories swal={swal} />
));
