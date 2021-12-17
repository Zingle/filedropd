def APP_NAME = 'com.medallia.zingle.filedropd'
def DOCKER_PREFIX = 'virtual-docker.martifactory.io'
def DOCKER_PATH = 'medallia/zingle/filedropd'
def MANIFEST_FILE = 'ci-manifest.json'

pipeline {
  agent {
    label 'general'
  }
  options {
    ansiColor('xterm')
    timeout(time: 10, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '3'))
  }
  stages {
    stage('install citools') {
      steps {
        sh "/home/jenkins/.local/bin/citools-install.sh"
      }
    }
    stage('calculate version') {
      steps {
        script {
          version = calculateVersion()
        }
      }
    }
    stage('build and generate artifacts') {
      steps {
        script {
          sh "docker build -t ${DOCKER_PREFIX}/${DOCKER_PATH}:${version} ."
          sh "docker push ${DOCKER_PREFIX}/${DOCKER_PATH}"
          sh "./ci/citools/bin/citools generateDockerArtifact --dockerVersion ${version} --dockerPath ${DOCKER_PATH}"
          sh "./ci/citools/bin/citools generateManifest --appName ${APP_NAME} --appVersion ${version}"
        }
      }
    }
    stage('publish manifest') {
      when {
        expression { BRANCH_NAME ==~ /(master|v[0-9]+\.[0-9]+)/ }
      }
      steps {
        script {
          try {
            sh './ci/citools/bin/citools publishManifest'
            sh './ci/citools/bin/citools tagManifest --tag committed'
          } catch (exception) {
            slackSend channel: "eng-rafiki-monitoring", message: "Error publishing manifest ${APP_NAME}/${version}, ${env.BUILD_URL}"
          }
        }
      }
    }
  }
  post {
    always {
      script {
        sh "docker rmi ${DOCKER_PREFIX}/${DOCKER_PATH}:${version} | true"
        if (fileExists(MANIFEST_FILE)) {
          archiveArtifacts artifacts: MANIFEST_FILE
        }
        deleteDir()
      }
    }
  }
}

def calculateVersion() {
  def version = sh script: './ci/citools/bin/citools printPreReleaseVersion', returnStdout: true
  return version.trim().split("\n").last().trim()
}
