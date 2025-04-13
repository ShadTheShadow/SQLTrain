
//This currently isn't a priorityqueue, it's just an outline to test functionality
class PriorityQueue{
    constructor(){
        this.data = [];
    }

    enqueue(node){

        if (this.data.length == 0){
            this.data.push(node)
            return true
        }


        for (var i = 0; i < this.data.length; i++){
            if (node.time < this.data[i].time){
                this.data.splice(i,0,node)
                return true;
            }
        }

        //Adds to end if biggest time
        this.data.push(node)

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
        return this.data.length == 0
    }

    size(){
        return this.data.length
    }
}


module.exports = PriorityQueue;