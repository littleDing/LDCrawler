#include <sys/types.h>
#include <sys/stat.h>
#include <unistd.h>
#include <dirent.h>
#include <stdio.h>
#include <string.h>

#define MAX_PATH 8024

/* dirwalk:  apply fcn to all files in dir */
void dirwalk(const char *dir, void (*fcn)(const char *))
{
	char name[MAX_PATH];
	struct dirent *dp;
	DIR *dfd;
	int len=strlen(dir);
	strcpy(name,dir);	
	name[len++]='/';

	if ((dfd = opendir(dir)) == NULL) {
		fprintf(stderr, "dirwalk: can't open %s\n", dir);
		return;
	}
	while ((dp = readdir(dfd)) != NULL) {
		if (strcmp(dp->d_name, ".") == 0
		    || strcmp(dp->d_name, "..") == 0)
			continue;    /* skip self and parent */
		strcpy(name+len,dp->d_name);
		(*fcn)(name);
	}
	closedir(dfd);
}


char* site;
/* fsize:  print the size and name of file "name" */
void scan_links(const char *filename)
{
	struct stat stbuf;
	if (stat(filename, &stbuf) == -1) {
		fprintf(stderr, "scan_links: can't access %s\n", filename);
		return;
	}
	if ((stbuf.st_mode & S_IFMT) == S_IFDIR)
		dirwalk(filename, scan_links);
	else
		printf("%s/%s\n", site, filename+2);
}

int main(int argc, char **argv)
{
	site=argv[1];
	scan_links(".");	
	return 0;
}


