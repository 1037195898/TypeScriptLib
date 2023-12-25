export class Path {

    private path: string

    constructor(base: string, ...subpaths: string[]) {
        this.path = base
        subpaths.forEach( (value) => {
            if (value.startsWith("/")) {
                this.path += value
            } else this.path += `/${value}`
        })
    }

    static of(base: string, ...subpaths: string[]) {
        return new Path(base, ...subpaths)
    }

    string() {
        return this.path
    }

}