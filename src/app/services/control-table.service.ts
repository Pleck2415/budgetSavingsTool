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

  getTableElements(tableName: string, withType: boolean) {
    var elementList: any[] = [];
    firebase.database().ref(tableName + "/").orderByValue().on("value", function(data) {   
      data.forEach(function(data) {
        var elementId = data.val().id;
        var description = data.val().description;
        var active = data.val().active;
        if (withType) {
          var typeId = data.val().typeId;
          elementList.push({id: elementId, description: description, typeId: typeId, active: active});
        } else {
            elementList.push({id: elementId, description: description, active: active});
          }
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
        const myID = data.val().id;
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
         if (data.val().description === newValue) {
          isUnique = false;
         };
      });            
   });
   return isUnique;
  }

  deleteEntry(tableName: string, id: string) {
    firebase.database().ref(tableName + "/" + id).remove();
  }
}
