import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native'
import db from '../config'
import firebase from 'firebase'
import MyHeader from '../components/MyHeader'

export default class ExchangeScreen extends Component {
    constructor(){
        super();
        this.state = {
            userId : firebase.auth().currentUser.email,
            userName: '',
            objectName: '',
            reasonToRequest:'',
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    getUserName = async() => {
      db.collection("users").where("email_Id","==",this.state.userId).get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            this.setState({
              userName: doc.data().first_name
            })
          })
        })
    }

    addRequest = async(objectName,reasonToRequest)=>{
        var userId = this.state.userId;
        var randomRequestId = this.createUniqueId();
        db.collection('requested_objects').add({
            "user_id": userId,
            "object_name":objectName,
            "reason_to_request":reasonToRequest,
            "request_id"  : randomRequestId,
            "requested_by" : this.state.userName
        })
    
        this.setState({
            objectName :'',
            reasonToRequest : ''
        })
    
        return Alert.alert(" Requested Successfully")
      }

      componentDidMount(){
        this.getUserName();
      }

    render(){
        return(
            <View style={{flex:1}}>
              <MyHeader title="Barter System"/>
                <KeyboardAvoidingView style={styles.keyBoardStyle}>
                  <TextInput
                    style ={styles.formTextInput}
                    placeholder={"enter object name"}
                    onChangeText={(text)=>{
                        this.setState({
                            objectName:text
                        })
                    }}
                    value={this.state.objectName}
                  />
                  <TextInput
                    style ={[styles.formTextInput,{height:300}]}
                    multiline
                    numberOfLines ={8}
                    placeholder={"Why do you need this object?"}
                    onChangeText ={(text)=>{
                        this.setState({
                            reasonToRequest:text
                        })
                    }}
                    value ={this.state.reasonToRequest}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={()=>
                        {this.addRequest(this.state.objectName,this.state.reasonToRequest)}
                    } >
                    <Text>Request</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    keyBoardStyle : {
        alignItems:'center',
        justifyContent:'center',
      },
      formTextInput:{
        width:"75%",
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10,
      },
      button:{
        width:"75%",
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:"#ff5722",
        shadowColor: "#000",
        shadowOffset: {
           width: 0,
           height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop:20
      },
})
