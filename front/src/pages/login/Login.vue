<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page>
        <div class="row">
          <div class="col-12 col-md-8 flex flex-center" style="background: #E6EDF9;height: 100vh" v-if="!$q.screen.lt.md">
            <div style="position: absolute; top: 25px; left: 40px">
<!--              <div class="q-ml-lg">-->
<!--                <q-img src="icon.svg" width="25px" class="q-mr-md" />-->
              <q-img src="logoLargo.png" width="150px" />
<!--              </div>-->
<!--              <q-img src="dark-logo-text-CiIbURQ-.svg" width="100px" />-->
            </div>
            <q-img src="login-bg-BprgzFH_.svg" width="450px" />
          </div>
          <div class="col-12 col-md-4 flex flex-center ">
            <q-form @submit="login" class="q-gutter-md" style="max-width: 400px">
            <div class="row q-pa-lg">
              <div class="col-12 flex flex-center">
                <q-img src="logoLargo.png" width="150px" />
              </div>
              <div class="col-12 text-h6 text-bold">Bienvenido al sistema</div>
              <div class="col-12 text-subtitle1">Inicia sesión para continuar</div>
              <div class="col-12 q-pt-md">
                <label for="username" class="text-bold">Usuario</label>
                <q-input outlined v-model="username"
                         :rules="[val => !!val || 'Este campo es requerido']" />
              </div>
              <div class="col-12">
                <label for="password" class="text-bold">Contraseña</label>
                <q-input outlined v-model="password" :type="showPassword? 'text' : 'password'" @click:append="showPassword = !showPassword" append-icon="visibility" :rules="[val => !!val || 'Este campo es requerido']" >
                  <template v-slot:append>
                    <q-icon :name="showPassword? 'visibility_off' : 'visibility'"  @click="showPassword = !showPassword" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 row items-center">
                <q-checkbox v-model="remember" label="Recordar usuario" />
                <q-space />
                <a href="">
                  <span class="text-caption">¿Olvidaste tu contraseña?</span>
                </a>
              </div>
              <div class="col-12 q-mt-md">
                <q-btn color="blue" label="Iniciar sesión" class="full-width" no-caps :loading="loading" type="submit" />
              </div>
              <div class="col-12 q-mt-md">
                No tienes cuenta? <a href="">Regístrate</a>
              </div>
            </div>
            </q-form>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      remember: false,
      loading: false,
      showPassword: false
    }
  },
  methods: {
    login() {
      this.loading = true
      this.$axios.post('login', {
        username: this.username,
        password: this.password
      }).then(res => {
        const user = res.data.user
        const token = res.data.token
        this.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        this.$store.isLogged = true
        this.$store.user = user
        this.$store.permissions = user.permissions
        this.$store.env = res.data.datos
        localStorage.setItem('tokenEducation', token)
        this.$alert.success('Bienvenido ' + user.name)
        this.$router.push('/')
      }).catch(error => {
        this.$alert.error(error.response.data.message)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
