const fs = require("fs");

class ProductManager {
  constructor(file) {
    this.path = file + ".json";
    this.products = [];
    this.nextId = 1;
  }

  async addProduct(product) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        if (data) {
          this.products = JSON.parse(data);

          // Validar que todos los campos sean obligatorios
          if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.stock
          ) {
            console.log("Error: Todos los campos son obligatorios");
            return;
          }

          // Validar que no se repita el campo "code"
          if (this.products.find((p) => p.code === product.code)) {
            console.log("Error: El código ya existe");
            return;
          }

          // Agregar el producto con un id autoincrementable
          product.id = this.nextId++;
          this.products.push(product);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(this.products, null, "\t")
          );
        }
        console.log("Producto agregado correctamente");
      } else {
        product.id = this.nextId++;
        await fs.promises.writeFile(
          this.path,
          JSON.stringify([product], null, "\t")
        );
        console.log("Producto agregado correctamente");
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        if (data) {
          this.products = JSON.parse(data);
          return this.products;
        }
      } else {
        console.log("No existe el archivo, por favor cree uno");
      }
    } catch (error) {
      throw new Error("Error: ", error);
    }
  }

  async getProductById(id) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        if (data) {
          this.products = JSON.parse(data);
          const product = this.products.find((p) => p.id === id);
          if (product) {
            return product;
          } else {
            console.log(`Error: Producto con el id "${id}" no encontrado`);
          }
        }
      } else {
        console.log("No existe el archivo, por favor cree uno");
      }
    } catch (error) {
      throw new Error("Error: ", error);
    }
  }

  async updateProductById(id, product) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        if (data) {
          this.products = JSON.parse(data);
          const index = this.products.findIndex((p) => p.id === id);
          if (index !== -1) {
            this.products[index] = { ...this.products[index], ...product };
            await fs.promises.writeFile(
              this.path,
              JSON.stringify(this.products, null, "\t")
            );
            console.log("Has actualizado correctamente el producto");
          } else {
            console.log("Error: Producto no encontrado");
          }
        } else {
          console.log("No existe el archivo, por favor cree uno");
        }
      }
    } catch (error) {
      throw new Error("Error: ", error);
    }
  }

  async removeProductById(id) {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf-8");
        if (data) {
          this.products = JSON.parse(data);
          const index = this.products.findIndex((p) => p.id === id);
          if (index !== -1) {
            this.products.splice(index, 1);
            await fs.promises.writeFile(
              this.path,
              JSON.stringify(this.products, null, "\t")
            );
            console.log("Producto eliminado correctamente");
          } else {
            console.log("Error: Producto no encontrado");
          }
        } else {
          console.log("No existe el archivo, por favor cree uno");
        }
      }
    } catch (error) {
      throw new Error("Error: ", error);
    }
  }

  async removeAllProducts() {
    try {
      if (fs.existsSync(this.path)) {
        this.products = [];
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.products, null, "\t")
        );
        console.log("Todos los productos han sido eliminados");
      } else {
        console.log("No existe el archivo, por favor cree uno");
      }
    } catch (error) {
      throw new Error("Error: ", error);
    }
  }
}




// Prueba de funcionamiento, primero, creamos una instancia de ProductManager
const manager = new ProductManager("Productos");

// Agregamos productos para poder pobrar:

(async function () {
    await manager.addProduct({
        title: "Producto 1",
        description: "Descripción del producto 1",
        price: 10.99,
        thumbnail: "path/imagen1.jpg",
        code: "prod123",
        stock: 5,
    });
    await manager.addProduct({
        title: "Producto 2",
        description: "Descripción del producto 2",
        price: 234.30,
        thumbnail: "path/imagen2.jpg",
        code: "prod456",
        stock: 3,
    });
    await manager.addProduct({
        title: "Producto 3",
        description: "Descripción del producto 3",
        price: 23.23,
        thumbnail: "path/imagen2.jpg",
        code: "prod789",
        stock: 8,
    })
    await manager.addProduct({
        title: "Producto 4",
        description: "Descripción del producto 4",
        price: 3.34,
        thumbnail: "path/imagen4.jpg",
        code: "prod101113",
        stock: 15,
    })
})();

// Funcion prueba para  traer todos los productos

//(async function () { console.log(await manager.getProducts()); })();


// Funcion prueba para traer algunos por su id
//(async function () { console.log(await manager.getProductById(2)); })();

// Funcion prueba para obtener un producto por un id inexistente
//manager.getProductById(100);

// Funcion prueba para actualizar un producto por su id:

//(async function () { await manager.updateProductById(3, { title: "Producto 3 actualizado" }) })();

// Funcion prueba para eliminar un producto por su id:

//(async function () { await manager.removeProductById(3) })();

// Funcion prueba para eliminar todos los productos, porque quien no quiere hacer eso?:

//(async function () { await manager.removeAllProducts() })();
