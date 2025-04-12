
//This currently isn't a priorityqueue, it's just an outline to test functionality
class PriorityQueue{
    constructor(){
        this.data = [];
    }

    enqueue(node){
        this.data.splice(0,0,node)
        return true
    }

    dequeue(){
        
        if (this.data.length > 0){
            return this.data.shift()
        }
        return null
    }

    peek(){
        if (this.data.length > 0){
            return this.data[0]
        }
        return null
    }

    isEmpty(){

    }

    size(){

    }
}


module.exports = PriorityQueue;