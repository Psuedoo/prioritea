import {
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl">Welcome to Prioritea!</h1>
      <ProjectTable />
    </main>
  );
}

const ProjectTable = () => {
  const projects = [
    {
      name: "Low Impact, Low Effort",
      impact: 1,
      levelOfEffort: 1,
    },
    {
      name: "High Impact, Low Effort",
      impact: 5,
      levelOfEffort: 1,
    },
    {
      name: "Low Impact, High Effort",
      impact: 1,
      levelOfEffort: 5,
    },
    {
      name: "High Impact, High Effort",
      impact: 5,
      levelOfEffort: 5,
    },
  ];

  const projectRows = projects.map((project) => (
    <Tr key={project.name}>
      <Td>{project.name}</Td>
      <Td isNumeric>{project.impact}</Td>
      <Td isNumeric>{project.levelOfEffort}</Td>
    </Tr>
  ));

  return (
    <Box bgColor="brand.brown" borderRadius="lg">
      <TableContainer>
        <Table variant="unstyled">
          <TableCaption>Your Projects</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th isNumeric>Impact</Th>
              <Th isNumeric>Level of Effort</Th>
            </Tr>
          </Thead>
          <Tbody>{projectRows}</Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
