TARGETS = scan_links

output : all
	cp $(TARGETS) ../bin/


all : $(TARGETS)

scan_links : scan_links.cpp
	g++ -o $@ $<

clean :
	-rm $(TARGETS)
	
