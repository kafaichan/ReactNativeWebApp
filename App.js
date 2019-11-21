import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Vibration
} from 'react-native'

var Sound=require('react-native-sound')

class App extends Component {
  state = {
    corrects: 0,
    currentIndex: 0,
    isDisabled: false,
    buttonClass: [
      {}, {}, {}, {}
    ],
    statusBarWidth: new Animated.Value(1),
      sounds: {
        correct: null,
        incorrect: null,
    },
    topics: [
      {
        question: 'JavaScript 與 Java 有什麼關係？',
        answers: [
          {
            value: '同公司的產品',
            correct: false,
          },
          {
            value: '新版與舊版的關係',
            correct: false,
          },
          {
            value: '一點關係也沒有',
            correct: true,
          },
          {
            value: 'JavaScript 是 Java 的 Web 版本',
            correct: false,
          },
        ]
      },
      {
        question: '發明 React JS 的公司是？',
        answers: [
          {
            value: 'Google',
            correct: false,
          },
          {
            value: 'Facebook',
            correct: true,
          },
          {
            value: 'Apple',
            correct: false,
          },
          {
            value: 'Microsoft',
            correct: false,
          },
        ]
      }
    ]
  }

  next = (index, correct) => {
    // 1.
    if (correct) {
      this.setState({
        corrects: this.state.corrects + 1,
      })
      this.state.sounds.correct.play()
    }else {
    	this.state.sounds.incorrect.play()
    	Vibration.vibrate(500)
    }

    this.setState({
      isDisabled: true,
    })

    // 2.
    let newButtonClass = [...this.state.buttonClass]
    newButtonClass[index] = (correct) ? {backgroundColor: '#4FFF87'} : {backgroundColor: '#FF7056'}
    this.setState({
      buttonClass: newButtonClass
    })

    // 3
    setTimeout(() => {
      Animated.timing(this.state.statusBarWidth, {
        toValue: (this.state.currentIndex + 1) / this.state.topics.length * 100,
        duration: 500,
      }).start()

      this.setState({
        currentIndex: this.state.currentIndex + 1,
        buttonClass: ['', '', '', ''],
        isDisabled: false,
      })
    }, 1500)
  }

  startOver = () => {
    this.setState({
      corrects: 0,
      currentIndex: 0,
      buttonClass: [
        {}, {}, {}, {}
      ],
      statusBarWidth: new Animated.Value(1),
    })
  }

componentDidMount() {
  let correct = new Sound('correct.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
  });

  let incorrect = new Sound('incorrect.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
  });

  this.setState({
    sounds: {
      correct: correct,
      incorrect: incorrect,
    }
  })
}
  render() {
    const width = this.state.statusBarWidth.interpolate({
      inputRange: [0, 100],
      outputRange: [0, Dimensions.get('window').width],
    })

    return (
      <View style={ styles.App }>
        <Animated.View style={ {...styles.statusBar, width: width} }></Animated.View>

        {this.state.currentIndex < this.state.topics.length ?
          (
            <View style={ styles.topicsContainer }>
              <Text style={ styles.question }>{ this.state.topics[this.state.currentIndex].question }</Text>

              {this.state.topics[this.state.currentIndex].answers.map((answer, index) => {
                return (
                  <TouchableOpacity key={index} style={ {...styles.button, ...this.state.buttonClass[index]} } onPress={() => this.next(index, answer.correct)}>
                    <Text style={ styles.answer }>{answer.value}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          ) : (
            <View style={ styles.result }>
              <Text style={ styles.resultTitle }>Completed!</Text>
              <Text style={ styles.score }>Your Score is {(Math.round((this.state.corrects / this.state.topics.length) * 100)) || 0}</Text>
              <TouchableOpacity style={ styles.button } onPress={this.startOver}>
                <Text style={ styles.answer }>Start Over</Text>
              </TouchableOpacity>
            </View>
          )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  App: {
    
  },
  statusBar: {
    height: 5,
    backgroundColor: '#FFBA4F',
    width: '1%',
  },
  topicsContainer: {
    padding: 20,
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    padding: 20,
    marginBottom: 20,
  },
  answer: {
    fontSize: 22,
    textAlign: 'center',
  },
  result: {
    padding: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 60,
  },
  score: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  }
})

export default App;
