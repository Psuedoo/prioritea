"use client";

import { AddIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { TaskContext } from "./context";

interface Task {
  name: string;
  impact: number;
  levelOfEffort: number;
}

export const TaskTable = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  function deleteTask(task: Task) {
    if (!tasks) {
      return;
    }
    let newTasks = tasks.filter((t) => t.name !== task.name);
    setTasks(newTasks);
  }

  return (
    <>
      <TaskContext.Provider value={{ tasks, setTasks }}>
        {tasks.length === 0 ? (
          <div className="flex flex-col justify-center items-center">
            <p>No Tasks.</p>
            <AddTaskButton />
          </div>
        ) : (
          <Box bgColor="brand.brown" borderRadius="lg">
            <TableContainer>
              <Table variant="unstyled">
                <TableCaption>
                  <AddTaskButton />
                </TableCaption>
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th isNumeric>Impact</Th>
                    <Th isNumeric>Level of Effort</Th>
                    <Th>Editing</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tasks.map((task) => (
                    <Tr key={task.name}>
                      <Td>{task.name}</Td>
                      <Td isNumeric>{task.impact}</Td>
                      <Td isNumeric>{task.levelOfEffort}</Td>
                      <Td>
                        <EditTaskButton task={task} />
                        <DeleteIcon
                          _hover={{ cursor: "pointer" }}
                          onClick={() => {
                            deleteTask(task);
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </TaskContext.Provider>
    </>
  );
};

const AddTaskButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskName, setTaskName] = useState("");
  const [taskImpact, setTaskImpact] = useState(1);
  const [taskLevelOfEffort, setTaskLevelOfEffort] = useState(1);
  const { tasks, setTasks } = useContext(TaskContext);

  function addTask(task: Task) {
    console.log("Adding task", task);
    if (!tasks) {
      setTasks([task]);
      onClose();
      return;
    }
    let newTasks: Task[] = [...tasks, task];
    setTasks(newTasks);
    setTaskName("");
    setTaskImpact(1);
    setTaskLevelOfEffort(1);
    onClose();
  }

  return (
    <>
      <Button leftIcon={<AddIcon />} onClick={onOpen}>
        Add Task
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTask({
                    name: taskName,
                    impact: taskImpact,
                    levelOfEffort: taskLevelOfEffort,
                  });
                }
              }}
            >
              <FormLabel>Name</FormLabel>
              <Input
                value={taskName}
                onChange={(event) => {
                  setTaskName(event.target.value);
                }}
                placeholder="Dishes"
                type="text"
              />
              <FormLabel>Impact</FormLabel>
              <NumberInput
                value={taskImpact}
                onChange={(event) => {
                  setTaskImpact(Number(event));
                }}
                defaultValue={1}
                max={5}
                min={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                1 is low impact, 5 is high impact.
              </FormHelperText>
              <FormLabel>Level of Effort</FormLabel>
              <NumberInput
                value={taskLevelOfEffort}
                onChange={(event) => {
                  setTaskLevelOfEffort(Number(event));
                }}
                defaultValue={1}
                max={5}
                min={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                1 is low effort, 5 is high effort.
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                addTask({
                  name: taskName,
                  impact: taskImpact,
                  levelOfEffort: taskLevelOfEffort,
                });
              }}
            >
              Add Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const EditTaskButton = (props: { task: Task }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [taskName, setTaskName] = useState(props.task.name);
  const [taskImpact, setTaskImpact] = useState(props.task.impact);
  const [taskLevelOfEffort, setTaskLevelOfEffort] = useState(
    props.task.levelOfEffort
  );
  const { tasks, setTasks } = useContext(TaskContext);

  function editTask(task: Task) {
    if (!tasks) {
      return;
    }

    let storedTaskIndex = tasks.indexOf(props.task);
    tasks[storedTaskIndex] = {
      name: task.name,
      impact: task.impact,
      levelOfEffort: task.levelOfEffort,
    };
    setTasks([...tasks]);
    onClose();
  }

  return (
    <>
      <EditIcon
        _hover={{ cursor: "pointer" }}
        className="mr-2"
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  editTask({
                    name: taskName,
                    impact: taskImpact,
                    levelOfEffort: taskLevelOfEffort,
                  });
                }
              }}
            >
              <FormLabel>Name</FormLabel>
              <Input
                value={taskName}
                onChange={(event) => {
                  setTaskName(event.target.value);
                }}
                placeholder="Dishes"
                type="text"
              />
              <FormLabel>Impact</FormLabel>
              <NumberInput
                value={taskImpact}
                onChange={(event) => {
                  setTaskImpact(Number(event));
                }}
                defaultValue={1}
                max={5}
                min={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                1 is low impact, 5 is high impact.
              </FormHelperText>
              <FormLabel>Level of Effort</FormLabel>
              <NumberInput
                value={taskLevelOfEffort}
                onChange={(event) => {
                  setTaskLevelOfEffort(Number(event));
                }}
                defaultValue={1}
                max={5}
                min={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                1 is low effort, 5 is high effort.
              </FormHelperText>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                editTask({
                  name: taskName,
                  impact: taskImpact,
                  levelOfEffort: taskLevelOfEffort,
                });
              }}
            >
              Edit Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
