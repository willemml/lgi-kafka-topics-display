/*
  Written by Benjamin Debotté, gist:
  https://gist.github.com/BenjaminDebotte/be5238cf045374505ce211de5a702f68
*/

import React from "react";
import { Container, List } from "semantic-ui-react";

class Landing extends React.Component {

    constructor(props) {
        super(props);

        this.state = { // Here we initialize the State Store this component will use
            data: {
                stray_topics: [], // Empty stray_topics
                flume: [], // Empty flume
                spark: [], // Empty empty spark
                snmp_trap_topics: [] // Empty snmp
            }
        }
    }

    /*
    This methods fires when component is successfully mounted by React.
    It's the perfect moment to retrieve data

    */
    componentDidMount(props) {
        fetch('/kafka-topics.json').then(function(response) { // First we fetch the data
            return response.json(); // Converting it to JSON
          }).then(function(kafkaTopics) {
            this.setState({ // Using setState allows to dynamically change data displayed by our component
                data: kafkaTopics // kafkaTopics contains our data. It will fill spark, flume, ...
            });
          }.bind(this)); // We need to bind this function to `this` to be able to call `this.setState`.
    }

    render() {
        return (
        <Container fluid>
            <List bulleted>
                <List.Item>
                    Stray Topics
                    {this.state.data.stray_topics.map(function(stray_topic){
                        return <List.Item key={stray_topic.name}>{stray_topic.name}</List.Item>; //Display all the stray_topics
                    })}
                </List.Item>
                <List.Item>
                    Flume Topics
                    {this.state.data.flume.map(function(flume_entry){
                        return <List.Item key={flume_entry.name}>{flume_entry.name}</List.Item>; //Display all the flume entries
                    })}
                </List.Item>
                <List.Item>
                    SNMP Trap Topics
                    {this.state.data.snmp_trap_topics.map(function(snmp_entry){
                        return <List.Item key={snmp_entry}>{snmp_entry}</List.Item>; // Display all snmp
                    })}
                </List.Item>

                <List.Item>

                    Spark topics
                    {
                    /*
                    This part is a bit more tricky than the previous one as we have to loop into each spark job,
                    then into their input and output.
                    */
                    this.state.data.spark.map(function(spark_entry){
                        return (
                        <List.Item key={`${spark_entry.name}-${spark_entry.tenant}-${spark_entry.job_name}`}>
                            {`${spark_entry.name}-${spark_entry.tenant}-${spark_entry.job_name}`}
                            <List.Item key={`${spark_entry.name}-${spark_entry.tenant}-${spark_entry.job_name}-input`}>
                            Input
                            {spark_entry.input.map(function(input){
                                return <List.Item key={input.name}>{input.name}</List.Item>;
                            })}
                            </List.Item>
                            <List.Item key={`${spark_entry.name}-${spark_entry.tenant}-${spark_entry.job_name}-output`}>
                            Output
                            {spark_entry.output.map(function(output){
                                return <List.Item key={output.name}>{output.name}</List.Item>;
                            })}
                            </List.Item>
                        </List.Item>
                        )
                    })}
                </List.Item>
            </List>
        </Container>)
    }
}

export default Landing;
