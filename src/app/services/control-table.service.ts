import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
@Injectable({
  providedIn: 'root'
})
export class ControlTableService {

  elementNextID: number = 0;
  
  constructor() { }

  saveNewElement(tableName: string, element: any, elementId: number) { 
    firebase.database().ref(tableName + "/" + elementId).set(element);
  }

  getTableElements(tableName: string) {
    var elementList: any[] = [];
    firebase.database().ref(tableName + "/").orderByValue().on("value", function(data) {   
      data.forEach(function(data) {
        var elementId = data.val().entryId;
        var description = data.val().description;
        var typeId = data.val().typeId;
        var active = data.val().active;
        elementList.push({entryId: elementId, description: description, typeId: typeId, active: active});
      });
    });
    return elementList;
  }

  getTypeDescription(id: number, typesList: any) {
    var description: string = "";
    typesList.forEach(element => {
      if (element.id == id) {
        description = element.description;
      }
    });
    return description;
  }

  getTypeId(description: string, typesList: any) {
    var myId: number = 0;
    typesList.forEach(element => {
      if (element.description == description) {
        myId = element.id;
      }
    });
    return myId;
  }

  getElementNextID(tableName: string) {     
    var nextID = 0;    
    const userID = firebase.auth().currentUser.uid;
    firebase.database().ref(tableName + "/").limitToLast(1)
    .on('child_added', function(data) {
        const myID = data.val().entryId;
        console.log('Query in service: ', myID);
    if( myID == null) {
        nextID = 0;
    } else {
        nextID = myID +1;
        }
    });
    return nextID;
  }

  uniqueField(tableName: string, newValue: any) {
    var isUnique: boolean = true;
    firebase.database().ref(tableName + "/").orderByValue().on("value", function(data) {   
      data.forEach(function(data) {
        console.log("In service unique description: ", data.val().description + " and newValue: " + newValue);
         if (data.val().description === newValue) {
          isUnique = false;
         };
      });            
   });
   return isUnique;
  }

  deleteEntry(tableName: string, entryId: string) {
    firebase.database().ref(tableName + "/" + entryId).remove();
    // var mPostReference = firebase.database().ref(tableName + "/").child("entryId").child(entryId);
    console.log('Entry [ ' + entryId + ' ] deleted!');
    // mPostReference.remove();
  }
}