<template>
  <div class="home">
    <Header>
      <div slot="action-left" class="icon-button" tag="button" @click="signOut">
        <img class="icon" :src="require('../assets/account.png')">
      </div>
      <router-link slot="action-right" class="icon-button" tag="button" to="/post/novo">
        <img class="icon" :src="require('../assets/new.png')">
      </router-link>
    </Header>
    <div v-if="posts.length">
      <Card v-for="post in posts" :key="post.id" :post="post" />
    </div>
    <div v-else class="empty">
      Ainda não temos posts cadastrados. :(
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Card from '@/components/Card'
import firebase from 'firebase'

let postSnapshotListener = null

export default {
  name: 'feed',
  data () {
    return {
      posts: []
    }
  },
  components: {
    Header,
    Card
  },
  mounted () {
    const userUid = firebase.auth().currentUser.uid

    // firebase.firestore().collection('posts')
    //   .where('userUid', '==', userUid).get()
    //   .then(snapshot => {
    //     snapshot.docs.map(doc => {
    //       this.posts.push(doc.data())
    //     })
    //   }).catch(error => {
    //     throw new Error(error)
    //   })

    postSnapshotListener = firebase.firestore().collection('posts')
      .where('userUid', '==', userUid)
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            this.posts.push(change.doc.data())
          }

          if (change.type === 'modified') {
            const { id } = change.doc.data()
            const currentObject = this.posts.filter(post => post.id === id)[0]

            this.posts[this.posts.indexOf(currentObject)] = change.doc.data()
            this.$forceUpdate()
          }

          if (change.type === 'removed') {
            const { id } = change.doc.data()
            const currentObject = this.posts.filter(post => post.id === id)[0]

            this.posts.splice(this.posts.indexOf(currentObject), 1)
            this.$forceUpdate()
          }
        })
      })
  },

  destroyed () {
    // unsubscribe listener
    postSnapshotListener()
  },

  methods: {
    signOut () {
      firebase.auth().signOut().then(() => {
        alert('Desconectado com sucesso!')
        this.$router.push('/login')
      }).catch(error => {
        alert('Erro ao desconectar. \n\n' + error)
      })
    }
  }
}
</script>

<style scoped>
  .icon {
    width: 30px;
    height: 30px;
  }
  .icon-button {
    background: none;
    border: none;
    cursor: pointer;
  }
  .empty {
    font-family: 'Montserrat', sans-serif;
    padding: 1em;
    text-align: center;
    margin-top: 5em;
    font-size: 1.5em;
  }
</style>
