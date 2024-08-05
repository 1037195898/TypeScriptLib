function initBean(...cls: { new(): any }[]) {
    cls.forEach(value => {
        // @ts-ignore
        if (!tsCore.App.inst.hasBean(value.name)) {
            const target = new value()
            // @ts-ignore
            tsCore.App.inst.addBean(value.name, target)
        }
    })
}

function getBean<T>(name: string | { new(): T }): T {
    if (typeof name !== "string") {
        name = name.name
    }
    // @ts-ignore
    return tsCore.App.inst.getBean(name)
}

/**
 * 一个用于创建组件的高阶函数，它接受一个类作为参数，并返回一个继承了该类的新类。
 * 这个新类会在实例化时自动注册到应用的容器中，以便于依赖注入和管理。
 *
 * @param classTarget 被装饰的类。
 * @return 返回一个继承了传入类的新类。
 */
function Component<T extends { new(...args: any[]): {} }>(classTarget: T) {
    const classTemp = class extends classTarget {
        constructor(...args: any[]) {
            super(...args)
            const name = classTarget.name
            // @ts-ignore
            if (!tsCore.App.inst.hasBean(name)) {
                // @ts-ignore
                tsCore.App.inst.addBean(name, this)
            }
            // @ts-ignore
            let beanProperty = tsCore.App.beanClassProperty.get(name)
            beanProperty?.forEach(value => {
                // @ts-ignore
                const propertyClass = Reflect.getMetadata("design:type", this, value)
                const propertyName = propertyClass.name
                // @ts-ignore
                if (!tsCore.App.inst.hasBean(value) && tsCore.App.beanClassComponent.has(propertyName)) {
                    // @ts-ignore
                    const newProperty = new (tsCore.App.beanClassComponent.get(propertyName))()
                    console.log("create class " + propertyName)
                    // @ts-ignore
                    if (!tsCore.App.inst.hasBean(value)) {
                        // @ts-ignore
                        tsCore.App.inst.addBean(value, newProperty)
                    }
                }
                // @ts-ignore
                this[value] = tsCore.App.inst.getBean(value)
            })
        }
    }
    Object.defineProperty(classTemp,  "name", {
        get(): any {
            return classTarget.name
        }
    })
    // @ts-ignore
    tsCore.App.beanClassComponent.set(classTemp.name, classTemp)
    return classTemp
}
/**
 * 一个装饰器函数，用于标记类的属性，该属性对应的对象会被自动实例化并注册到应用的容器中。
 * 这个函数主要解决了如何自动实例化和注册类的依赖，以便于在应用中使用时能够轻松地进行依赖注入。
 *
 * @param target 被装饰的类的实例。
 * @param propertyKey 被装饰的属性的键名。
 */
function Resource(target: any, propertyKey: string) {
    const classTarget = Reflect.getMetadata("design:type", target, propertyKey)
    if (classTarget) {
        // @ts-ignore
        let bean = tsCore.App.beanClassProperty.get(target.constructor.name) || []
        bean.push(propertyKey)
        // @ts-ignore
        tsCore.App.beanClassProperty.set(target.constructor.name, bean)
    } else throw Error("class type null")
}
/**
 * Bean装饰器函数，用于自动注册带有该装饰器的类实例到应用容器中
 * 它通过反射机制获取类的返回类型，并将类实例注册为一个Bean
 *
 * @param target 被装饰的类的原型
 * @param propertyKey 被装饰的方法的属性名
 * @param descriptor 被装饰的方法的属性描述符
 */
function Bean(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const returnTarget = Reflect.getMetadata("design:returntype", target, propertyKey)
    if (returnTarget) {
        // @ts-ignore
        tsCore.App.inst.addBean(propertyKey, descriptor.value.call(target))
    } else throw Error("class type null")
}