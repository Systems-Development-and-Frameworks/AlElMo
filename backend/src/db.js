import { DataSource } from 'apollo-datasource'
import crypto from 'crypto'

const { Users, Posts } = require("./datasource")

export class Post {
    constructor(data) {
        this.id = crypto.randomBytes(16).toString('hex')
        this.usersUpvoted = []
        this.votes = 0
        this.title = data.post.title
        this.author = data.post.author.name
        //Object.assign(this, data)
    }
}

export class User {
    constructor(data) {
        //this.id = crypto.randomBytes(16).toString('hex')
        Object.assign(this, data)
    }
}

export class InMemoryDataSource extends DataSource {
    constructor(posts = [], users = []) {
        super()
        this.posts = posts
        this.users = users
    }

    initialize(...args) {
        // console.log(args)
    }

    //Data: {id, title, votes, author, usersUpvoted[]}
    createPost(data) {
        console.log(data)
        const newPost = new Post(data)
        this.posts.push(newPost)
        return newPost
    }

    //Data : {name(ID), posts[] }
    /*
    createUser(data) {
        const newUser = new User(data)
        this.users.push(newUser)
        return newUser
    }*/

    //Data : {postID, user, upvote-1/+1}
    upvotePost(data) {
        console.log(data)
        const updatedPost = this.posts.find(post => post.id == data.id)
        const userName = data.voter.name
        if (updatedPost) {
            console.log("1")
            if (!updatedPost.usersUpvoted.includes(userName)) {
                console.log("2")
                updatedPost.votes += data.value
                updatedPost.usersUpvoted.push(userName)
                console.log(updatedPost)
            }
        }
        return updatedPost
    }
}