import { useEffect, useRef } from "react";
import { Drawing } from "./drawing";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useEditorStore } from "./state";
import { CircleShape, RectShape, Shape } from "./Shape";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { immerable, produce } from "immer";

function getShapeName(shape: Shape) {
  return shape.constructor.name;
}

function ShapeList() {
  const { shapes, setSelectedShapeId } = useEditorStore(
    useShallow((state) => ({
      shapes: state.shapes,
      setSelectedShapeId: state.setSelectedShapeId,
    }))
  );

  function onShapeClick(shape: Shape) {
    setSelectedShapeId(shape.id);
  }
  return (
    <div className=" w-full flex flex-col h-full overflow-y-auto">
      {shapes.map((shape, index) => (
        <div
          className="p-1 hover:bg-orange-100"
          key={index}
          onClick={() => onShapeClick(shape)}
        >
          {getShapeName(shape) + shape.id}
        </div>
      ))}
    </div>
  );
}
function NumInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      className="w-full  "
      type="number"
      value={value}
      onInput={(e) => onChange((e.target as HTMLInputElement).valueAsNumber)}
    />
  );
}
function ShapeProperties({ shape }: { shape: Shape }) {
  return (
    <div>
      <div>
        <strong>x:</strong>
        <NumInput
          value={shape.center.x}
          onChange={(value) => {
            useEditorStore.getState().updateShape(shape.id, (shape) => {
              shape.center.x = value;
            });
            
          }}
        />
      </div>
      <div>
        <strong>y:</strong>
        {shape.center.y}
      </div>
      <div>
        <strong>color:</strong>
        {shape.color.toString()}
      </div>
      <div>
        <strong>id:</strong>
        {shape.id}
      </div>
      {/* circle */}
      {shape instanceof CircleShape && (
        <div>
          <div>
            <strong>radius:</strong>
            {shape.radius}
          </div>
        </div>
      )}
      {/* rect */}
      {shape instanceof RectShape && (
        <div>
          <div>
            <strong>width:</strong>
            {shape.width}
          </div>
          <div>
            <strong>height:</strong>
            {shape.height}
          </div>
        </div>
      )}
    </div>
  );
}
function PropertyPanel() {
  const _selectedShapeId = useEditorStore((state) => state.selectedShapeId);
  const shapes = useEditorStore((state) => state.shapes);
  const selectedShape = useEditorStore.getState().getSelectedShape();
  console.log("selectedShape", selectedShape);
  return (
    <div className="w-full h-full bg-blue-200">
      <div>Properties</div>
      {selectedShape && (
        <ShapeProperties key={selectedShape.id} shape={selectedShape} />
      )}
    </div>
  );
}

function Editor() {
  const canvasDivRef = useRef<HTMLDivElement | null>(null);
  const drawingRef = useRef<Drawing>();
  // const shapes = useEditorStore((state) => state.shapes);

  useEffect(() => {
    drawingRef.current = new Drawing(canvasDivRef.current!);

    return () => {
      if (drawingRef.current) {
        drawingRef.current.clearHtml();
      }
    };
  }, []);
  return (
    <div className=" w-full fixed h-full p-5 flex justify-center self-center">
      <div className="w-[250px]  h-full">
        <ShapeList />
      </div>
      <div
        className="w-full h-full bg-blue-200 relative "
        ref={canvasDivRef}
      ></div>
      <div className="w-[250px] bg-green-200 h-full">
        <PropertyPanel />
      </div>
    </div>
  );
}
export default function VectorEditor2() {
  return <Editor />;
  // return <ZustandTest />;
}

interface BearState {
  bears: number;
  cats: number;
  names: string[];
  increase: (by: number) => void;
  increaseCats: (by: number) => void;
  removeAll: () => void;
  addName: (name: string) => void;
  popName: () => void;
  setName: (index: number, name: string) => void;
}

const useBearStore = create<BearState>()(
  subscribeWithSelector((set) => ({
    bears: 0,
    cats: 0,
    names: ["aaa", "bbb", "ccc"],
    increase: (by) => set((state) => ({ bears: state.bears + by })),
    increaseCats: (by) => set((state) => ({ cats: state.cats + 1 })),
    removeAll: () => set({ bears: 0, cats: 0 }),
    addName: (name: string) =>
      set((state) => ({ names: [...state.names, name] })),
    popName: () => set((state) => ({ names: state.names.slice(0, -1) })),
    setName: (index: number, name: string) =>
      set((state) => {
        const names = [...state.names];
        names[index] = name;
        return { names };
      }),
  }))
);
interface Person {
  name: string;
  age: number;
}
class User {
  name = "user";
  age = 20;
  [immerable] = true;
}
interface UserState {
  user: User;
  person: Person;
  users: User[];
  nums: number[];
  updateName: (name: string) => void;
  updateAge: (age: number) => void;

  updatePersonName: (name: string) => void;
  updatePersonAge: (age: number) => void;

  updateNum: (index: number, num: number) => void;
}
const userStore = create<UserState>()(
  immer((set, get) => ({
    user: new User(),
    users: [new User()],
    nums: [1, 2, 3],
    updateName: (name: string) => {
      set((state) => {
        state.user.name = name;
      });
    },
    updateAge: (age: number) => {
      set((state) => {
        state.user.age = age;
      });
    },
    person: { name: "person", age: 20 },
    updatePersonName: (name: string) => {
      set((state) => {
        state.person.name = name;
      });
    },
    updatePersonAge: (age: number) => {
      set((state) => {
        state.person.age = age;
      });
    },
    updateUser: (user: User) => {
      set((state) => {
        state.users[0] = user;
      });
    },
    updateNum: (index: number, num: number) => {
      set((state) => {
        state.nums[index] = num;
      });
    },
  }))
);
userStore.subscribe((state) => {
  console.log("user ", state.users);
});
setInterval(() => {
  userStore.setState((state) => {
    const user = state.users[0];
    user.age++;
    state.users[0] = user;
  });

  // userStore.getState().updateNum(0, userStore.getState().nums[0] + 1);
}, 1000);

//sub to bears
const sub = useBearStore.subscribe(
  (state) => state.names,
  (bears, oldBears) => {
    console.log("names ", bears, oldBears);
  }
);
function ZustandTest() {
  //names
  const names = useBearStore((state) => state.names);
  const addName = useBearStore((state) => state.addName);
  const setName = useBearStore((state) => state.setName);
  const popName = useBearStore((state) => state.popName);

  const users = userStore((state) => state.users);

  console.log("render");
  console.log(names);
  //buttons
  return (
    <div>
      {/* users */}
      <div>
        {users.map((user, index) => (
          <div key={index}>
            <div>
              name:{user.name}
              {index} age:{user.age}
            </div>
          </div>
        ))}
      </div>

      {/* names */}
      <div>
        {names.map((name, index) => (
          <div key={index}>
            <input
              value={name}
              onChange={(e) => setName(index, e.target.value)}
            />
          </div>
        ))}
        <button onClick={() => addName(Date().toString())}>Add name</button>
        <button onClick={popName}>Pop name</button>
      </div>
    </div>
  );
}
