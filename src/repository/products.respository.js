
export class ProductRepository{
    
    constructor(dao){
        this.dao = dao;
    }

    async addProduct(product){
        const result = await this.dao.post(product);
        return result;
    }

    async getProducts(query, options){
        const result = await this.dao.get(query, options);
        return result;
    }

    async getProductById(pid){
        const result = await this.dao.getProduct(pid);
        return result;
    }

    async updateProduct(pid, product){
        const result = await this.dao.put(pid, product);
        return result;
    }
    
    async deleteProductById(pid){
        const result = await this.dao.delete(pid);
        return result;
    }

}