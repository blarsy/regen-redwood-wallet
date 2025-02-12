export class DataLoadState<T> {
    data?: T
    loading: boolean
    error?: Error
    constructor(data: T|undefined, loading: boolean, error?: Error) {
        this.data = data
        this.loading = loading
        this.error = error
    }
}