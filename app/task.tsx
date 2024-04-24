"use client";

import { AddIcon } from "@chakra-ui/icons";
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
import { createContext, useContext, useState } from "react";

const TaskContext = createContext({
  tasks: [],
  setTasks: (value: Task[]) => {
    return value;
  },
});

interface Task {
  name: string;
  impact: number;
  levelOfEffort: number;
}

export const TaskTable = () => {
  const [tasks, setTasks] = useState<Task[]>();
  const value = { tasks, setTasks };

  const taskRows = tasks?.map((task) => (
    <Tr key={task.name}>
      <Td>{task.name}</Td>
      <Td isNumeric>{task.impact}</Td>
      <Td isNumeric>{task.levelOfEffort}</Td>
    </Tr>
  ));

  return (
    <TaskContext.Provider value={value}>
      {tasks ? (
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
                </Tr>
              </Thead>
              <Tbody>{taskRows}</Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <>
          <p>No tasks yet!</p>
          <AddTaskButton />
        </>
      )}
    </TaskContext.Provider>
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
            <FormControl>
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
