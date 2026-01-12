import { useEffect, useState } from "react";

const MidiController = () => {
    const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
    const [error, setError] = useState('');
    const [midiInput, setMidiInput] = useState('')
    const [midiFreq, setMidiFreq] = useState<number | null>(null)

    const requestAccess = async () => {
        if (!navigator.requestMIDIAccess) {
            setError('Web MIDI API is not available in this browser.');
            return;
        }

        try {
            const midi = await navigator.requestMIDIAccess({ sysex: true });
            setMidiAccess(midi);
            console.log('Midi Access granted:', midi);
            //Setup Midi Devices
            setupMidiDevices(midi)
        } catch (err: unknown) {
            setError(`Failed to get MIDI access: ${err}`);
            console.error('MIDI access failed', err)
        }
    }

    const setupMidiDevices = (midiAccess: MIDIAccess) => {
        const inputs = midiAccess.inputs.values();
        for (let input of inputs) {
            console.log(`Found input device: ${input.name} (${input.manufacturer})`);
            // input.onmidimessage = onMidiMessage;
        }

        // Listen for device connections/disconnections
        midiAccess.onstatechange = (event: MIDIConnectionEvent) => {
            if (event.port != null) {
                console.log('MIDI device state change:', event.port.name, event.port.state);
            }
        }
    }

    function onMIDIMessage(event: MIDIMessageEvent) {
        if (event.data != null) {
            let str = `MIDI message received at timestamp ${event.timeStamp}[${event.data.length} bytes]: `;
            if(event.data[0] != 248) {
                console.log("midi message: ", event.data);
            }
            setMidiFreq(midiNoteToFrequency(event.data[1]))
            // for (const character of event.data) {
            //     str += `0x${character.toString(16)} `;
            // }
            // console.log(str);
        }
    }

    function startLoggingMIDIInput(midiAccess: MIDIAccess | null) {
        if (midiAccess != null) {
            midiAccess.inputs.forEach((entry: MIDIInput) => {
                entry.onmidimessage = onMIDIMessage;
            });
        }
    }

    function midiNoteToFrequency(note: number) {
        return Math.pow(2, ((note - 69) / 12)) * 440;
    }

    useEffect(() => {
        startLoggingMIDIInput(midiAccess)
        // if (midiAccess != null) {
        //     midiAccess.onstatechange = (event: MIDIConnectionEvent) => {
        //         if (event.port != null) {
        //             console.log('MIDI device state change:', event.port.name, event.port.state);
        //         }
        //     }
        // }
    })

    // useEffect(() => {
    //     //Get midi controller function
    //     //Call function
    //     //Return and clean up if controller disconnects
    // })
    return (
        <button className='default-btn' id='midi-request' onClick={requestAccess}>Turn on midi</button>
    )
};

export default MidiController