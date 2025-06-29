## FEA Hinge

High pressure sensors are quite expensive, and also unnecessary. Burying pressure sensors under layers of different materials like TPU and altering the shape over the pressure sensor will change the actual pressure the pressure sensor receives. Effectively it works like a lever: the edge around the sensor can act like the short end of the lever, and the area above the sensor can act as the long end, dividing the total force so we can use cheaper sensors.
- [amazon 20g to 2kg sensors, 3$ per sensor](https://www.amazon.com/Pressure-Sensitivity-Sensitive-Industrial-Measurement/dp/B0CZ6L5NMM?th=1)
- [sparkfun 200kg force sensor 64$ per sensor](https://www.sparkfun.com/load-cell-200kg-s-type-tas501.html)

The hinge and thus the sensor pressure range can be determined using Finite Element Analysis and expected pressure on the surface.

## Conductive Foam Touch Sensor Array

In addition to the previous optimization, conductive foam can be cut into pieces and electrodes places on both sides for a cheap pressure sensor. Each foam sensor would need to be calibrated individually.
For a grid to address each one, a transistor should be at each crossing in the grid, and when the anode and cathode are both active, the transistor activates, allowing the electrons to pass over only that section of foam. Otherwise, some multi-touches may not be distinguishable from single touch.
- [Blog](http://iainmccurdy.org/diy/forcesensorfoam/forcesensorfoam.html)
- [Instructables](https://www.instructables.com/Arduino-pressure-sensor-FSR-with-LCD-display/)
- [Another instructables](https://www.instructables.com/DIY-Force-Sensitive-Resistor-FSR/)

practically, this requires a pick and place machine and a wire embedding machine

## Wire-Grid Capacitive Touch Sensor Array

Using an FPGA and a grid of wires can create a RC circuit with the C being the crossing section of the wires, as long as there's a small dielectric layer in between. Since it's a very small capacitor, high frequency is required, but the mhz from the fpga clock should work. Reading the values from all the perpendicular wires will give the different pressure values.
This can also be improved with transistors at the intersections, but mhz speed transistors may be hard to find.

practically, this requires a pick and place machine and a wire embedding machine

## Nylon Touch/Vibration sensors

Wound nylon can be used as an artificial muscle, but it may be better as a sensor given it responds to changes in length once wound. multiple electrodes could be placed along the length, and it would either require an ammeter per section, or a multiplexer to select the different sections and measure one by one. [YouTube video](https://youtu.be/_zeR2s6Y8vQ?t=617)
