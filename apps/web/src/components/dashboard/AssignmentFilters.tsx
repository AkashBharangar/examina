import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { Card } from '@/components/shared/Card';
import { SearchIcon } from '@/components/shared/Icons';

type AssignmentFiltersProps = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function AssignmentFilters({ search, status, onSearchChange, onStatusChange }: AssignmentFiltersProps) {
  return (
    <Card className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]" padded>
      <Input
        label="Search assignments"
        placeholder="Search by title, subject, or tag"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        leadingIcon={<SearchIcon className="h-4 w-4" />}
      />
      <Select label="Status" value={status} onChange={(event) => onStatusChange(event.target.value)}>
        <option value="all">All statuses</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="grading">Grading</option>
      </Select>
    </Card>
  );
}
