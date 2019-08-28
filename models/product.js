const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const getProductsFromFile = () => {
  let fsPromise = new Promise((resolve, reject)=>{
    fs.readFile(p, (err, fileContent) => {
      if(err) reject(err);
      else{
        let parsedContent = JSON.parse(fileContent);
        resolve(parsedContent)
      }
    });
  })
  return fsPromise;
  
};

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    let savePromise = new Promise(async (resolve, reject)=>{
      let products;
      try{
        products = await getProductsFromFile();
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), err => {
          if(err) throw(err);
        });
        resolve(products);
      } catch(err){
        reject(err)
      }
    })
    return savePromise          
  }

  static delete(id) {
    let deletePrmise = new Promise(async (resolve, reject)=>{

      let products;
      try{
        products = await getProductsFromFile();
      } catch(err){
        reject(err)
      }
      const result = products.filter(product => product.id !== id);
      try{
        await this.saveAll(result, cb);
        resolve();
      } catch(err){
        reject(err);
      }
    })
    return deletePrmise;
  }


  static fetchAll() {
    return getProductsFromFile();
  }

  static findById(id) {
    let products;
    let findPromise = new Promise(async (resolve, reject)=>{
      try{
        products = await getProductsFromFile()
        let product;
        product = products.find(p => p.id === id);
        resolve(product);
      } catch(err){
        reject(err);
      };
    })
    return findPromise;
    
  }

  static saveAll(products, cb) {
    let savePromise = new Promise((resolve, reject)=>{
      try{
        fs.writeFile(p, JSON.stringify(products), err => cb(err))
        resolve();
      } catch(err){
        reject(err)
      }
    })
    return savePromise;
  }
};