---
title: Brushless motors
category: Electro-mechanical system
---

# Brushless motors

Brushless motors, in bulk, can be as cheap as brushed motors now, including the microchips required to drive them.
They're also silent and won't make robots sound like a beehive at best, and tend to be much more powerful for their size since they can handle higher voltages. (V=IR, and R stays about the same, so doubling or quadrupling V also double I, and W = I*V, so delta_W ~= delta_V^2)

However, some sizes don't have economics of scale. In that case, it can sometimes be cheaper to 3d print the bldc motors, if much more labor intensive:

- [YouTube Video Example](https://www.youtube.com/watch?v=OZarwftUh8w)
- [Google Drive Document](https://drive.google.com/drive/folders/1Au5g3SLIfi7Hd1thS2vI8csxB3VvxQ5b)

## Creating a brushless DC motor

### why create a BLDC motor instead of buying one

Many brushless DC motors are made for drones or turing propellers underwater. Drones typically need very high RPMs, while underwater motors need lower RPM speeds so the tip of the propeller doesn't cavitate the water, which leads to inefficiency and destroys the propeller. Water pumps on the other hand don't necessarily immediately come into contact with still water, so may benefit from higher RPM values, but if it is a pump designed to be inside the center of a flexible hydraulic actuator to provide maximum flexibility, then it may be best to keep the axle fixed and run electrodes along it, while the out-runner cylinder is combined with the the pump blades.

Also, BLDC motors in contact with water typically require bearings designed to not rust, and ensuring all electronics are fully insulated is much more important as well.

### 3D printed BLDC motors

There are several 3d printing projects for creating brushless DC motors, some higher quality than others, some more unique:

- [adjoneses - Thingiverse](https://www.thingiverse.com/thing:4311858/files)
- [Caden Kraft - Blog](https://cadenkraft.com/creating-a-3d-printed-brushless-motor)
- [Cool Stuff - YouTube](https://www.youtube.com/watch?v=NGpWn_s0hi0)
- [HomeMade Projects - YouTube](https://www.youtube.com/watch?v=OZarwftUh8w)
- [TheGoofy - Instructables](https://www.instructables.com/600-Watt-3d-printed-Halbach-Array-Brushless-DC-Ele/)

### Winding the stator coils

[This video](https://www.youtube.com/watch?v=ntXip9jjPTg) details a modification to 3D printers to automatically wind coils. This is [an accompanying article](https://homofaciens.de/technics-machines-Winding-Machine_en.htm) to the video.

It isn't fully automatic however. This is an example of [fully automatic machine](https://www.youtube.com/shorts/XCHWRI18tOs).

### Measuring motor specifications

#### KV

kv is roughly rpm/volt, and there's often an ideal rpm and voltage for different applications

[Measuring Kv](https://fishpepper.de/2017/10/17/tutorial-how-to-measure-the-kv-of-a-brushless-motor/).

#### Accurate simulation

FEMM is designed for simulating electromagnets and magnetic fields. [This post](https://things-in-motion.blogspot.com/2019/02/how-to-model-bldc-pmsm-motors-kv.html) details using that to simulate a BLDC motor.
