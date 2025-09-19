import { Model } from "mongoose";
import { IRepository } from "./repository.interface";

/**
 * BaseRepository is an abstract class that implements the IRepository interface.
 * It provides a base implementation for repositories using Mongoose models.
 * @template T - The type of the document managed by the repository.
 */
export abstract class BaseRepository<T> implements IRepository<T> {
    protected readonly model: Model<T>;
    /**
     * Creates an instance of BaseRepository.
     * @param model - The Mongoose model to use for database operations.
     */
    constructor(model: Model<T>) {
        this.model = model;
    }

    /**
     * Returns all documents of type T from the database.
     * @returns A promise that resolves to an array of documents of type T.
     */
    async findAll(): Promise<T[]> {
        return this.model.find().lean().exec() as Promise<T[]>;
    }

    /**
     * Finds a document of type T by its ID.
     * @param id - The ID of the document to find.
     * @returns A promise that resolves to the found document, or null if not found.
     */
    async findById(id: string): Promise<T | null> {
        return this.model.findById(id).lean().exec() as Promise<T | null>;
    }

    /**
     * Finds a single document of type T that matches the provided filter.
     * @param filter - The filter to apply when searching for the document.
     * @returns A promise that resolves to the found document, or null if not found.
     */
    async findOne(filter: Partial<T>): Promise<T | null> {
        return this.model.findOne(filter).lean().exec() as Promise<T | null>;
    }

    /**
     * Finds all documents of type T that match the provided filter.
     * @param filter - The filter to apply when searching for documents.
     * @returns A promise that resolves to an array of documents that match the filter.
     */
    async findAllThatMatch(filter: Partial<T>): Promise<T[]> {
        return this.model.find(filter).lean().exec() as Promise<T[]>;
    }

    /**
     * Creates a new document of type T in the database.
     * @param document - The document to create.
     * @returns A promise that resolves to the created document.
     */
    async create(document: T): Promise<T> {
        const createdDocument = (await new this.model(document).save()).toObject();
        return createdDocument;
    }

    /**
     * Updates an existing document of type T in the database.
     * @param id - The ID of the document to update.
     * @param document - The updated document data.
     * @returns A promise that resolves to the updated document, or null if not found.
     */
    async update(id: string, document: Partial<T>): Promise<T | null> {
        const updatedDocument = await this.model.findByIdAndUpdate(
            id,
            document,
            { new: true, lean: true }
        ).exec();
        return updatedDocument as T | null;
    }  

    /**
     * Deletes a document of type T from the database.
     * @param id - The ID of the document to delete.
     * @returns A promise that resolves to the deleted document, or null if not found.
     */
    async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id).exec();
    }


}
