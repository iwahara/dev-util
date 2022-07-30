import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Button } from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';

import {
    ListItem,
    UnorderedList,
  } from '@chakra-ui/react'

  import {
    Editable,
    EditableInput,
    EditablePreview,
  } from '@chakra-ui/react'

  import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
  } from '@chakra-ui/react'

function CronParser(){
    const dummy :string[] = [];
    const defaultCron = "* * * * *";
    const defaultCount = 5;
    const [nextList, setNextList] = useState(dummy);
    const [targetDate, setTargetDate] = useState(new Date());
    const [cron, setCron] = useState(defaultCron);
    const [count, setCount] = useState(defaultCount)

    function commandCronFormatter(){
        invoke<string[]>('command_cron_formatter',{msg:{cron:cron, now:targetDate.toISOString(),count:count}}).then(message => {
            setNextList(message);
        }).catch(message => {
            console.error('command_cron_formatter', message);
        })
    }

    return (
        <div>
            <Editable colorScheme='blue' defaultValue={defaultCron} onChange={setCron}>
                <EditablePreview />
                <EditableInput />
            </Editable>
            <NumberInput defaultValue={defaultCount} min={1} max={100} value={count} onChange={(_valueString,valueAsNumber) => setCount(valueAsNumber)} >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <DateTimePicker onChange={setTargetDate} value={targetDate} disableClock={true} />
            <Button onClick={commandCronFormatter} colorScheme='blue'>パースする</Button>
            <div>
                <UnorderedList colorScheme='blue'>
                    {nextList.map((next:string,i:number) => {
                    return <ListItem key={next}>{new Date(next).toLocaleString()}</ListItem>
                })}
                </UnorderedList>
            </div>
        </div>
    );
    
}
export default CronParser;