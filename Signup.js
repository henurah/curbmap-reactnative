import React, { Component } from 'react'
import { StyleSheet, View, Image, TextInput, Text, Button, Dimensions, AsyncStorage} from 'react-native'
import MenuIcon from './MenuIcon'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
const {width, height} = Dimensions.get("window");


const styles = StyleSheet.create({
  full: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  loginbox: {
    marginTop: 10,
    padding: 10,
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,

  },
  buttonlogin: {
    fontSize: 20,
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 5
  },
  loginholder: {
    flexDirection: 'column',
    marginTop: height * 0.10,
    padding: 10,
    height: height * 0.7,
    width: width * 0.8
  },
  signuperror : {
    flexDirection: 'column',
    marginTop: height * 0.10,
    padding: 10,
    backgroundColor: 'rgba(255,0,0,0.7)',
    borderRadius: 10
  },
  signuperrortext: {
    color: 'white'
  },
  loginimageview: {
    alignItems: 'center',
  },
  loginimage: {
    height:150,
    width: 150
  }
});


class Signup extends Component {
  doSignup = () => {
    fetch('https://curbmap.com/token')
        .then((response) => response.text())
        .then((responseText) => {
          this.setState({XSRF: responseText})
        })
        .then(() => {
          fetch('https://curbmap.com/signup', {
            method: 'post',
            mode: 'cors',
            headers: {
              "X-XSRF-TOKEN": this.state.XSRF
            },
            body: JSON.stringify({
              username: this.state['user'],
              email: this.state['email'],
              password: this.state['pass']
            })
          }).then((responseSignup) => responseSignup.json()).then(
              (responseJSON) => {
                console.log(responseJSON);
                switch (responseJSON['success']) {
                  case 1:
                    this.props.navigation.navigate('Login', {'fromSignup': true});
                    break;
                  case -1:
                    this.setState({signuperror: 'Username taken'});
                    break;
                  case -2:
                    this.setState({signuperror: 'Email already used'});
                    break;
                  case -3:
                    this.setState({signuperror: 'Password needs one capital, lowercase, special, number, and be between 9 and 64 chars'});
                    break;
                  case -4:
                    this.setState({signuperror: 'Are you sure you entered the right email?'});
                    break;
                  default:
                    this.setState({signuperror: 'Something happened, try again...'});
                    break;
                }
              })
        })
  };

  constructor(props, context) {
    super(props, context);
    this.stateValues = {};
  }

  componentDidMount() {
  }

  static navigationOptions = {
    drawerLabel: 'Login',
    drawerIcon: ({tintColor}) => (
        <Image
            style={[styles.icon, {tintColor}]}
        />
    ),
  };

  _submit = () => {
    this.doSignup();
  };

  render() {
    let signuperror = <Text> </Text>;
    if (this.state != null && this.state['signuperror'] != null && this.state['signuperror'] !== undefined) {
      signuperror = <View style={styles.signuperror}><Text style={styles.signuperrortext}>{this.state['signuperror']}</Text></View>;
    }
    return (
        <View style={styles.full}>
          <MenuIcon onPress={() => this.props.navigation.navigate('DrawerOpen')} />
          <KeyboardAwareScrollView style={styles.loginholder} ref={(scrollObj) => {this.scrollView = scrollObj}}>
            <View style={styles.loginimageview}>
              <Image
                  style={styles.loginimage}
                  source={require('./assets/img/curbmap.png')}
              />
            </View>
            {signuperror}
            <TextInput
                ref="userInput"
                autoCorrect={false}
                autoCapitalize='none'
                style={styles.loginbox}
                onChangeText={(text) => this.setState({user: text})}
                placeholder='username'
                placeholderTextColor='lightgray'
                value={this.stateValues.user}
            />

            <TextInput
                ref="emailInput"
                autoCorrect={false}
                autoCapitalize='none'
                style={styles.loginbox}
                onChangeText={(text) => this.setState({email: text})}
                placeholder='email'
                placeholderTextColor='lightgray'
                value={this.stateValues.email}
            />

            <TextInput
                ref="passInput"
                autoCorrect={false}
                autoCapitalize='none'
                style={styles.loginbox}
                onChangeText={(text) => this.setState({pass: text})}
                placeholder="password"
                placeholderTextColor='lightgray'
                secureTextEntry={true}
                value={this.stateValues.pass}
            />

            <Button
                title="Signup"
                onPress={() => this._submit()}
                color="#841584"
                style={{fontSize: 20, color: 'green'}}>
              Signup
            </Button>
          </KeyboardAwareScrollView>
        </View>
    )
  }
}

export default Signup
