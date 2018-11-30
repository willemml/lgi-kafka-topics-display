// Author Willem Leitso

// Load libraries and style(s)
import React from 'react';
import ReactDOM from 'react-dom';
import Collapsible from 'react-collapsible';
import './main.scss';

// define variables and load json
var i;
var kafka_json = require('./kafka-topics.json');
var stray_topics = jsonToArray(kafka_json.stray_topics)
var snmp_trap_topics = jsonToArray(kafka_json.snmp_trap_topics)
var keys = Object.keys(kafka_json);
var spark = kafka_json.spark
let flumenames = kafka_json.flume.map(a => a.name);

// put console into an array
console.stdlog = console.log.bind(console);
console.logs = [];
console.log = function() {
  console.logs.push(Array.from(arguments));
  console.stdlog.apply(console, arguments);
}

// map the spark inputs
// eslint-disable-next-line
spark.map(sparkJob => {
  var sparkInputNames = [];
  var sparkOutputNames = [];
  let sparkInputs = sparkJob['input']
  let sparkOutputs = sparkJob['output']
  console.log("# Name: " + sparkJob['name']);
  for (let index in sparkInputs) {
    sparkInputNames.push(sparkInputs[index]['name'])
    console.log("Input: " + sparkInputs[index]['name'])
  }
  for (let index in sparkOutputs) {
    sparkOutputNames.push(sparkOutputs[index]['name'])
    console.log("Output: " + sparkOutputs[index]['name'])
  }
})


// load json objects into an array
function jsonToArray(input) {
  let output = [];
  for (i = 0; i < input.length; i++) {
    var add = [];
    add = (Object.values(input[i]))
    output.push(add)
  };
  return output;
};

// create list items
function ListItem(props) {
  return <li>{props.value}</li>;
}

// create list
function List(props) {
  return (<div>
    <Collapsible trigger={keys[props.title]}>
      <ul>
        {props.vars.map((textname) => <ListItem key={i++} value={textname} />)}
      </ul>
    </Collapsible>
  </div>);
}

// render everything
ReactDOM.render(<div>
  <List vars={stray_topics} title={0} textname={"straytopic"} />
  <List vars={flumenames} title={1} textname={"flume"} />
  <List vars={console.logs} title={2} textname={"spark"} />
  <List vars={snmp_trap_topics} title={3} textname={"snmp_trap_topics"} />
</div>, document.getElementById('root'));
